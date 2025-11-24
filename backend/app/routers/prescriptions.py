from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import google.generativeai as genai
from PIL import Image
import io
from app.database import get_db
from app.models import User, Prescription
from app.auth import get_current_user
from app.schemas import PrescriptionAnalysisResponse
from app.config import settings

router = APIRouter(prefix="/prescriptions", tags=["prescriptions"])

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

@router.post("/analyze", response_model=PrescriptionAnalysisResponse)
async def analyze_prescription(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Use Gemini Flash-Lite (cheapest model for free tier with vision capability)
        model = genai.GenerativeModel('gemini-2.0-flash-lite')
        
        # Structured prompt for machine-readable output
        prompt = """
        Analyze this prescription image and extract data in valid JSON format for automatic medication dispensing.

        Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
        {
          "prescription_id": "string or null",
          "prescription_date": "YYYY-MM-DD or null",
          "doctor_name": "string or null",
          "doctor_registration": "string or null",
          "hospital_clinic": "string or null",
          "patient": {
            "patient_name": "string or null",
            "patient_age": number or null,
            "patient_gender": "string or null",
            "patient_id": "string or null"
          },
          "medications": [
            {
              "medicine_name": "string",
              "generic_name": "string or null",
              "strength": "e.g., 500mg, 10ml",
              "dosage_form": "tablet/capsule/syrup/injection",
              "quantity_per_dose": number,
              "frequency": "e.g., 3 times daily",
              "frequency_code": "TID/BID/QD/QID/Q8H/Q12H",
              "timing": ["HH:MM", "HH:MM"],
              "duration_days": number,
              "total_quantity": number,
              "before_after_food": "before/after/with/empty stomach or null",
              "special_instructions": "string or null"
            }
          ],
          "diagnosis": "string or null",
          "allergies": ["string"] or null,
          "warnings": ["string"] or null,
          "follow_up_date": "YYYY-MM-DD or null",
          "emergency_contact": "string or null"
        }

        FREQUENCY CODES:
        - QD = Once daily, TID = 3 times daily, BID = 2 times daily, QID = 4 times daily
        - Q8H = Every 8 hours, Q12H = Every 12 hours
        
        For timing, use 24-hour format. Example: ["08:00", "14:00", "20:00"] for TID
        Calculate total_quantity = quantity_per_dose × frequency_per_day × duration_days
        
        If data is not visible, use null. Return ONLY the JSON, no other text.
        """
        
        response = model.generate_content([prompt, image])
        analysis_text = response.text
        
        # Parse JSON from AI response
        import json
        import re
        
        structured_data = None
        try:
            # Remove markdown code blocks if present
            json_text = re.sub(r'```json\s*|\s*```', '', analysis_text)
            json_text = json_text.strip()
            structured_data = json.loads(json_text)
        except:
            # If parsing fails, store None - raw text is still saved
            structured_data = None
        
        # Save to database
        prescription = Prescription(
            user_id=current_user.id,
            filename=file.filename,
            analysis=analysis_text,
            structured_data=structured_data
        )
        db.add(prescription)
        db.commit()
        db.refresh(prescription)
        
        return prescription
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing prescription: {str(e)}"
        )

@router.get("/history")
async def get_prescription_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prescriptions = db.query(Prescription).filter(
        Prescription.user_id == current_user.id
    ).order_by(Prescription.created_at.desc()).all()
    
    return prescriptions

@router.get("/{prescription_id}")
async def get_prescription(
    prescription_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single prescription by ID.
    Returns the complete prescription data including analysis and structured data.
    """
    prescription = db.query(Prescription).filter(
        Prescription.id == prescription_id,
        Prescription.user_id == current_user.id
    ).first()
    
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    return {
        "id": prescription.id,
        "filename": prescription.filename,
        "analysis": prescription.analysis,
        "structured_data": prescription.structured_data,
        "created_at": prescription.created_at
    }

@router.get("/{prescription_id}/structured")
async def get_structured_data(
    prescription_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get only the structured JSON data for a prescription.
    This endpoint is optimized for automatic dispensing machines.
    """
    prescription = db.query(Prescription).filter(
        Prescription.id == prescription_id,
        Prescription.user_id == current_user.id
    ).first()
    
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    if not prescription.structured_data:
        raise HTTPException(
            status_code=404, 
            detail="Structured data not available for this prescription"
        )
    
    return {
        "prescription_id": prescription.id,
        "filename": prescription.filename,
        "created_at": prescription.created_at,
        "data": prescription.structured_data
    }
