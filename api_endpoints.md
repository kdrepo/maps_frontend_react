# Backend URL and API Reference (Updated)

This document lists current pages and API endpoints, plus the key fields, behaviors, and background tasks.

## Web Pages (HTML)

### `/`
**Description:** Home/landing page (in-place vertical carousel).  
**Auth:** Public.

---

### `/login/`
**Description:** Password login page (email or mobile).  
**Auth:** Public.  
**If already logged in:** redirects to `/profile/`.

---

### `/otp-login/`
**Description:** Signup + OTP verification.  
**Auth:** Public.  
**If already logged in:** redirects to `/profile/`.

---

### `/submit/`
**Description:** Main submission form (file upload based).  
**Auth:** Login required.

---

### `/capture/`
**Description:** WebRTC capture submission form.  
**Auth:** Login required.

---

### `/duplicates/`
**Description:** Duplicate checker page (radius 250m).  
**Auth:** Login required.

---

### `/profile/`
**Description:** User profile + submissions table (pagination 5/page).  
**Auth:** Login required.

---

### `/logout/`
**Description:** Logs out and redirects to `/`.  
**Auth:** Login required.

---

### `/admin/`
**Description:** Django admin.  
**Auth:** Admin user required.

---

## API Endpoints

Base prefix: `/api/`

### Auth Notes (Frontend)
- The API now supports **JWT (Bearer tokens)** and **session auth** (for existing web templates).
- For SPAs/mobile:
  - Call `/api/auth/login/` or `/api/auth/verify-otp/` to receive `access` + `refresh`.
  - Send header: `Authorization: Bearer <access>`.
- Refresh tokens at `/api/auth/token/refresh/`.
- Public endpoints are explicitly marked below.

### `POST /api/auth/send-otp/`
**Description:** Send OTP for signup (also stores name/email/password hash).  
**Auth:** Public.

**Request (JSON):**
- `name` (string, required)
- `phone` (string, required, 10 digits)
- `email` (string, optional)
- `password` (string, required, min 8 chars, at least 1 digit)

**Response (JSON):**
```
{"detail": "OTP sent."}
```

---

### `POST /api/auth/verify-otp/`
**Description:** Verify OTP and create user account.  
**Auth:** Public.

**Request (JSON):**
- `phone` (string, required, 10 digits)
- `otp` (string, required, 4 digits)

**Response (JSON):**
```
{"detail": "Verified.", "user_id": 1, "access": "<jwt>", "refresh": "<jwt>"}
```

---

### `POST /api/auth/login/`
**Description:** Login with email or mobile + password.  
**Auth:** Public.

**Request (JSON):**
- `identifier` (string, required) — email or 10-digit phone
- `password` (string, required)

**Response (JSON):**
```
{"detail": "Logged in.", "user_id": 1, "access": "<jwt>", "refresh": "<jwt>"}
```

---

### `POST /api/auth/token/refresh/`
**Description:** Refresh access token.  
**Auth:** Public.

**Request (JSON):**
- `refresh` (string, required)

**Response (JSON):**
```
{"access": "<new_access>", "refresh": "<new_refresh>"}
```

---

### `POST /api/auth/token/verify/`
**Description:** Verify a token is valid.  
**Auth:** Public.

**Request (JSON):**
- `token` (string, required)

**Response (JSON):**
```
{}
```

---

### `POST /api/submissions/`
**Description:** Create a submission.  
**Auth:** Logged-in users only (session auth).

**Role rules:**
- `reviewer`: cannot submit
- `unknown`: must include at least one of `video`, `audio`, `note`, or `photos`
- `power_user`: no extra content restriction
- All roles must provide `client_lat`, `client_lng`, and `category`

**File size limits:**
- `photos`: max 10 MB each
- `video`: max 50 MB
- `audio`: max 5 MB

**Accepted fields (multipart/form-data):**
- `client_lat` (float, required)
- `client_lng` (float, required)
- `client_accuracy_m` (float, optional)
- `category` (string, required)
  - Values: `mazar`, `mosque`, `illegal_occupation`, `m_hotspot`, `conversion_hotspot`
- `video` (file, optional)
- `audio` (file, optional)
- `photos` (file[], optional, multiple)
- `note` (string, optional)
- `capture_lat` (float, optional)  
- `capture_lng` (float, optional)  
- `capture_accuracy_m` (float, optional)  
  - Used for **video** GPS verification when sent from WebRTC capture
- `photo_capture_lat` (float, optional)  
- `photo_capture_lng` (float, optional)  
- `photo_capture_accuracy_m` (float, optional)  
  - Used for **photo** GPS verification when sent from WebRTC capture

**Behavior:**
- Video GPS is taken from `capture_lat/lng` if present, otherwise extracted from metadata.
- Photo GPS is taken from `photo_capture_lat/lng` if present, otherwise extracted from metadata.
- Distances are computed against `client_lat/lng`.
- Status logic:
  - `gps_missing` if any uploaded media lacks GPS
  - `rejected` if any media distance > 100m
  - `pending` otherwise (awaiting reviewer approval)

**Response (JSON):**
```
{
  "id": 1,
  "client_lat": 12.34,
  "client_lng": 56.78,
  "client_accuracy_m": 12.0,
  "category": "mazar",
  "video": "/media/videos/....webm",
  "audio": "/media/audio/....webm",
  "note": "optional",
  "photos": [
    {"original": "/media/photos/....jpg", "compressed": "/media/photos_compressed/....jpg"}
  ],
  "capture_lat": 12.34,
  "capture_lng": 56.78,
  "capture_accuracy_m": 10,
  "photo_capture_lat": 12.34,
  "photo_capture_lng": 56.78,
  "photo_capture_accuracy_m": 9,
  "created_at": "2026-02-10T12:34:56Z",
  "created_by": 1,
  "video_gps_lat": 12.34,
  "video_gps_lng": 56.78,
  "video_gps_source": "capture|exiftool|ffprobe",
  "video_distance_m": 35.1,
  "photo_gps_lat": 12.34,
  "photo_gps_lng": 56.78,
  "photo_gps_source": "capture|exiftool|ffprobe",
  "photo_distance_m": 20.2,
  "status": "pending|approved|rejected|gps_missing"
}
```

---

### `POST /api/submissions/nearby/`
**Description:** Find submissions within 250 meters of a point.  
**Auth:** Logged-in users only (session auth).

**Request (JSON):**
- `client_lat` (float, required)
- `client_lng` (float, required)

**Response (JSON):**
```
[
  {
    "id": 12,
    "category": "mosque",
    "client_lat": 12.345678,
    "client_lng": 56.789012,
    "created_at": "2026-02-10T11:00:00Z",
    "distance_m": 120.5
  }
]
```

---

### `GET /api/states/{st_code}/summary/`
**Description:** Summary counts for a state code (from `state_index.json`).  
**Auth:** Public.

**Response (JSON):**
```
{
  "state_code": "29",
  "state_name": "Karnataka",
  "total_submissions": 123,
  "category_totals": {
    "mazar": 10,
    "mosque": 20,
    "illegal_occupation": 5,
    "m_hotspot": 7,
    "conversion_hotspot": 3
  },
  "total_cases_forwarded_to_police": 12,
  "total_police_action_taken": 4
}
```

---

### `GET /api/districts/{dt_code}/summary/`
**Description:** Summary counts for a district code (from `district_index.json`).  
**Auth:** Public.

**Response (JSON):**
```
{
  "district_code": "572",
  "district_name": "Bengaluru Urban",
  "total_submissions": 52,
  "category_totals": {
    "mazar": 4,
    "mosque": 6,
    "illegal_occupation": 2,
    "m_hotspot": 3,
    "conversion_hotspot": 1
  },
  "total_cases_forwarded_to_police": 5,
  "total_police_action_taken": 2
}
```

---

### `GET /api/districts/{dt_code}/records/`
**Description:** Paginated list (10/page) of submissions for a district code.  
**Auth:** Public.

**Fields returned per record:**
- `id`
- `category`
- `location` (from geodata display_name)
- `compressed_photo` (first photo compressed, fallback to original)
- `client_lat`, `client_lng`
- `video` (URL or null)
- `audio` (URL or null)
- `note`
- `addresstype`
- `forwarded_to_police`
- `police_action_type`
- `illegality_established`

**Response (JSON):**
```
{
  "count": 21,
  "next": "/api/districts/572/records/?page=2",
  "previous": null,
  "results": [
    {
      "id": 18,
      "category": "mosque",
      "location": "Some place, City, State, 560029, India",
      "compressed_photo": "/media/photos_compressed/....jpg",
      "client_lat": 12.345,
      "client_lng": 77.123,
      "video": "/media/videos/....webm",
      "audio": "/media/audio/....webm",
      "note": "optional",
      "addresstype": "road",
      "forwarded_to_police": true,
      "police_action_type": "in_progress",
      "illegality_established": false
    }
  ]
}
```

---

### `GET /api/india/summary/`
**Description:** India-level summary counts across all submissions.  
**Auth:** Public.

**Response (JSON):**
```
{
  "total_submissions": 1234,
  "category_totals": {
    "mazar": 10,
    "mosque": 20,
    "illegal_occupation": 5,
    "m_hotspot": 7,
    "conversion_hotspot": 3
  },
  "total_cases_forwarded_to_police": 120,
  "total_police_action_taken": 45
}
```

---

## Background Tasks (Django Q)

### Geocoding
After submission, a task calls **OpenStreetMap Nominatim** and stores:
- `addresstype`
- `type` (stored as `place_type`)
- `display_name`
- `address` (JSON)
- `boundingbox` (JSON)
- `state_code`, `state_name`, `district_code`, `district_name` (resolved via `state_index.json` and `district_index.json`)

Stored in: `SubmissionGeoData` (one-to-one with submission).

### Photo Compression
After submission, a task checks each photo:
- If > 500 KB, a compressed JPEG is created
- Stored in `SubmissionPhoto.image_compressed`

---

## Admin Review

**Where:** `/admin/` → Submissions  
**Who:** Users with role `reviewer` (or superuser)  
**Actions:** Reviewer can set status to `approved` or `rejected`.  
**Audit:** `reviewed_at` and `reviewed_by` are set automatically on change.

---

## Police Action Table

Each submission can have a linked **SubmissionPoliceAction** record:
- `forwarded_to_police` (bool)
- `illegality_established` (bool)
- `action_taken` (bool)
- `action_type` (choices):
  - No action
  - In progress
  - Demolished/Resolved
  - Action taken by Brave Hindus

Visible in admin as inline and standalone table.
