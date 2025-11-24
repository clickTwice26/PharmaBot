from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

# Medication Schema for Automatic Dispensing Machine
class MedicationDosage(BaseModel):
    medicine_name: str
    generic_name: Optional[str] = None
    strength: str  # e.g., "500mg", "10ml"
    dosage_form: str  # e.g., "tablet", "capsule", "syrup", "injection"
    quantity_per_dose: int  # number of units per dose
    frequency: str  # e.g., "3 times daily", "every 8 hours", "once daily"
    frequency_code: str  # machine-readable: "TID", "Q8H", "QD", "BID", "QID"
    timing: list[str]  # e.g., ["08:00", "14:00", "20:00"] in 24-hour format
    duration_days: int  # total treatment duration
    total_quantity: int  # total tablets/doses needed
    before_after_food: Optional[str] = None  # "before", "after", "with", "empty stomach"
    special_instructions: Optional[str] = None

class PatientDetails(BaseModel):
    patient_name: Optional[str] = None
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None
    patient_id: Optional[str] = None

class PrescriptionData(BaseModel):
    prescription_id: Optional[str] = None
    prescription_date: Optional[str] = None  # ISO format: "YYYY-MM-DD"
    doctor_name: Optional[str] = None
    doctor_registration: Optional[str] = None
    hospital_clinic: Optional[str] = None
    patient: PatientDetails
    medications: list[MedicationDosage]
    diagnosis: Optional[str] = None
    allergies: Optional[list[str]] = None
    warnings: Optional[list[str]] = None
    follow_up_date: Optional[str] = None
    emergency_contact: Optional[str] = None

class PrescriptionAnalysisResponse(BaseModel):
    id: int
    filename: str
    analysis: str  # raw AI text analysis
    structured_data: Optional[dict] = None  # parsed JSON schema
    created_at: datetime

    class Config:
        from_attributes = True
