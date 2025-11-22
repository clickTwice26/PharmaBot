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
        
        # Use Gemini to analyze the prescription
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = """
        You are a medical prescription analyzer. Analyze this prescription image and extract the following information:
        
        1. Patient Name (if visible)
        2. Doctor Name (if visible)
        3. Date (if visible)
        4. Medications prescribed (name, dosage, frequency)
        5. Special instructions or notes
        6. Any warnings or precautions
        
        Please format the response in a clear, structured manner.
        If any information is not clearly visible or readable, indicate that as well.
        """
        
        response = model.generate_content([prompt, image])
        analysis_text = response.text
        
        # Save to database
        prescription = Prescription(
            user_id=current_user.id,
            filename=file.filename,
            analysis=analysis_text
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
