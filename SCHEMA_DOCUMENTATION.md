# PharmaBot Structured Prescription Schema

## Overview
PharmaBot extracts prescription data into a **machine-readable JSON format** for automatic medication dispensing systems.

## Complete Schema Structure

```json
{
  "prescription_id": "string | null",
  "prescription_date": "YYYY-MM-DD | null",
  "doctor_name": "string | null",
  "doctor_registration": "string | null",
  "hospital_clinic": "string | null",
  "patient": {
    "patient_name": "string | null",
    "patient_age": "number | null",
    "patient_gender": "Male/Female/Other | null",
    "patient_id": "string | null"
  },
  "medications": [
    {
      "medicine_name": "string (required)",
      "generic_name": "string | null",
      "strength": "string (e.g., 500mg, 10ml)",
      "dosage_form": "tablet | capsule | syrup | injection | cream | drops",
      "quantity_per_dose": "number (units per dose)",
      "frequency": "string (human readable)",
      "frequency_code": "QD | BID | TID | QID | Q8H | Q12H",
      "timing": ["HH:MM", "HH:MM", ...],
      "duration_days": "number",
      "total_quantity": "number (total units needed)",
      "before_after_food": "before | after | with | empty stomach | null",
      "special_instructions": "string | null"
    }
  ],
  "diagnosis": "string | null",
  "allergies": ["string", ...] | null,
  "warnings": ["string", ...] | null,
  "follow_up_date": "YYYY-MM-DD | null",
  "emergency_contact": "string | null"
}
```

## Frequency Codes (Standard Medical Abbreviations)

| Code | Meaning | Times/Day | Example Timing |
|------|---------|-----------|----------------|
| QD | Once Daily | 1 | ["08:00"] |
| BID | Twice Daily | 2 | ["08:00", "20:00"] |
| TID | Three Times Daily | 3 | ["08:00", "14:00", "20:00"] |
| QID | Four Times Daily | 4 | ["08:00", "12:00", "16:00", "20:00"] |
| Q8H | Every 8 Hours | 3 | ["08:00", "16:00", "00:00"] |
| Q12H | Every 12 Hours | 2 | ["08:00", "20:00"] |
| Q6H | Every 6 Hours | 4 | ["00:00", "06:00", "12:00", "18:00"] |

## Example Response

```json
{
  "prescription_id": "RX123456",
  "prescription_date": "2025-11-24",
  "doctor_name": "Dr. Sarah Johnson",
  "doctor_registration": "MD12345",
  "hospital_clinic": "City General Hospital",
  "patient": {
    "patient_name": "John Doe",
    "patient_age": 45,
    "patient_gender": "Male",
    "patient_id": "P789012"
  },
  "medications": [
    {
      "medicine_name": "Amoxicillin",
      "generic_name": "Amoxicillin Trihydrate",
      "strength": "500mg",
      "dosage_form": "capsule",
      "quantity_per_dose": 1,
      "frequency": "3 times daily",
      "frequency_code": "TID",
      "timing": ["08:00", "14:00", "20:00"],
      "duration_days": 7,
      "total_quantity": 21,
      "before_after_food": "after",
      "special_instructions": "Complete full course"
    },
    {
      "medicine_name": "Paracetamol",
      "generic_name": "Acetaminophen",
      "strength": "650mg",
      "dosage_form": "tablet",
      "quantity_per_dose": 1,
      "frequency": "when needed for fever",
      "frequency_code": "PRN",
      "timing": [],
      "duration_days": 7,
      "total_quantity": 10,
      "before_after_food": null,
      "special_instructions": "Do not exceed 4 doses in 24 hours"
    }
  ],
  "diagnosis": "Upper Respiratory Tract Infection",
  "allergies": ["Penicillin", "Sulfa drugs"],
  "warnings": [
    "Complete full antibiotic course",
    "Avoid alcohol during treatment"
  ],
  "follow_up_date": "2025-12-01",
  "emergency_contact": "+1-555-0123"
}
```

## Calculation Rules

### Total Quantity Formula
```
total_quantity = quantity_per_dose × frequency_per_day × duration_days
```

**Examples:**
- 1 tablet × 3 times/day × 7 days = 21 tablets
- 2 capsules × 2 times/day × 5 days = 20 capsules

### Timing Generation

**BID (Twice Daily):** 12 hours apart
- Morning: 08:00, Evening: 20:00

**TID (Three Times Daily):** ~6-8 hours apart
- Morning: 08:00, Afternoon: 14:00, Night: 20:00

**QID (Four Times Daily):** 4-6 hours apart
- 08:00, 12:00, 16:00, 20:00

## Machine Integration

### Automatic Dispensing System Flow

1. **Scan Prescription** → Image to PharmaBot API
2. **Extract Data** → Structured JSON response
3. **Parse Medications** → For each medication:
   - Check inventory for `medicine_name` + `strength`
   - Schedule doses based on `timing` array
   - Load `total_quantity` into dispenser
   - Set `quantity_per_dose` per dispense
4. **Setup Alarms** → Program timing for each dose
5. **Patient Tracking** → Use `patient.patient_id`
6. **Safety Checks** → Verify against `allergies` and `warnings`

### API Response Structure

```json
{
  "id": 123,
  "filename": "prescription_001.jpg",
  "analysis": "raw AI text analysis...",
  "structured_data": { /* JSON schema above */ },
  "created_at": "2025-11-24T12:00:00Z"
}
```

## Field Validation Rules

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| medicine_name | string | Yes | Non-empty |
| strength | string | Yes | Must include unit (mg, ml, g, etc.) |
| dosage_form | enum | Yes | One of: tablet, capsule, syrup, injection, etc. |
| quantity_per_dose | number | Yes | > 0 |
| frequency_code | enum | Yes | Valid medical abbreviation |
| timing | array | No | 24-hour format HH:MM |
| duration_days | number | Yes | > 0 |
| total_quantity | number | Yes | >= quantity_per_dose |

## Handling Edge Cases

### PRN (As Needed) Medications
```json
{
  "frequency": "as needed for pain",
  "frequency_code": "PRN",
  "timing": [],
  "special_instructions": "Do not exceed 4 doses in 24 hours"
}
```

### Tapered Dosing
```json
{
  "medicine_name": "Prednisone",
  "special_instructions": "Day 1-3: 2 tablets, Day 4-6: 1 tablet, Day 7-10: 0.5 tablet"
}
```

### Multiple Strengths
Split into separate medication entries:
```json
{
  "medications": [
    {
      "medicine_name": "Insulin Regular",
      "strength": "10 units",
      "timing": ["08:00"]
    },
    {
      "medicine_name": "Insulin Regular",
      "strength": "15 units",
      "timing": ["20:00"]
    }
  ]
}
```

## Error Handling

If OCR fails or data is unclear, fields return `null`:
```json
{
  "patient_name": null,
  "medications": [
    {
      "medicine_name": "Partially readable text",
      "strength": null,
      "frequency": "unclear - manual review required"
    }
  ]
}
```

## Best Practices for Dispensing Machines

1. ✅ Always validate `structured_data` is not null
2. ✅ Check `allergies` before dispensing
3. ✅ Verify `total_quantity` against inventory
4. ✅ Use `frequency_code` for scheduling, not text `frequency`
5. ✅ Alert on `warnings` before first dose
6. ✅ Set reminders for `follow_up_date`
7. ✅ Log `patient_id` for all dispensing events
8. ✅ Handle `PRN` medications with manual trigger
9. ✅ Validate `timing` array length matches frequency
10. ✅ Store `emergency_contact` for critical alerts
