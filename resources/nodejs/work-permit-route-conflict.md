## Work Permit Routes: Problem and Fix

This note explains a real issue where member "Edit" was failing with `419 Access token expired`. The request was calling `verifyJWT` (primary user check) instead of `companyMemberVerifyJWT` (member check). The main reason was Express route matching and similar URL paths.

### Timeline & Symptoms

- Members opening Edit → Confirm & Save saw network errors:
  - `PATCH /api/v1/work-permit/<id>/submissions` returned `419`.
  - Server logs showed the request hit `verifyJWT`, not `companyMemberVerifyJWT`.
- Frontend sometimes redirected to member sign-in or surfaced the 419 error.

### Root Cause

1. Express route order and parameters
   - We had these routes (simplified) in `backend/routes/workPermitForm.routes.js`:
     - `/:workPermitFormId/submissions` (member, `companyMemberVerifyJWT`)
     - `/:companyId/:workPermitFormId` (admin update, `verifyJWT`)
   - Express matches routes from top to bottom. The admin route was too broad and came earlier, so it caught the request before the member route. A URL like `/123/submissions` was read as `{ companyId: 123, workPermitFormId: "submissions" }`, so it went to `verifyJWT`.

2. Frontend paths were similar
   - The admin update path looked similar to the member submissions path. This made mistakes easier.

3. Axios handling for member login
   - Our axios code refreshed token only for primary users. When a member token expired, we got `419`. Sometimes it redirected to sign‑in.

### Fixes Implemented

1. Made the admin route clear (backend)
   - Changed the admin update path to be clear and not clash:
     - From: `PATCH /work-permit/:companyId/:workPermitFormId`
     - To:   `PATCH /work-permit/company/:companyId/:workPermitFormId`

2. Reordered routes (backend)
   - Put the member route BEFORE the admin route:
     - `/:workPermitFormId/submissions` (member)
     - `/company/:companyId/:workPermitFormId` (admin)
   - Comment added in code to preserve this order.

3. Allow SUPER_ADMIN to edit (backend)
   - In `updateWorkPermitForm`, allow edit by form owner OR a user with `SUPER_ADMIN` role in the same company (via `CompanyAdmin`).

4. Frontend service update
   - Changed admin update call to the new path:
     - `axiosInstance.patch(/work-permit/company/${companyId}/${workPermitId}, ...)`.

5. Member Edit flow (frontend)
   - Member Edit uses `PATCH /work-permit/:workPermitFormId/submissions` (checked by `companyMemberVerifyJWT`).
   - In edit mode we skip the Opening/PTW popup and save directly.
   - After first submit, Fill is disabled. Edit stays and loads old answers.

6. Axios change (frontend)
   - Primary user: auto refresh token and retry.
   - Member: do not auto‑redirect on `419`; show error and let screen ask to sign in.

### Before vs After

| Aspect | Before | After |
|---|---|---|
| Member edit route | Sometimes matched admin route (`verifyJWT`) due to ordering | Always matches `/:workPermitFormId/submissions` (`companyMemberVerifyJWT`) |
| Admin update route | `/:companyId/:workPermitFormId` (overlaps) | `/company/:companyId/:workPermitFormId` (explicit, non-overlapping) |
| SUPER_ADMIN rights | Only owner could update form | Owner OR company `SUPER_ADMIN` can update |
| Axios member behavior | Sometimes auto‑redirect on 419 | No auto‑redirect; UI handles it |

### How to test quickly

1. Member (company user)
   - Fill → submission created → Fill disabled → Edit visible.
   - Edit → Confirm & Save → `PATCH /work-permit/:id/submissions` succeeds.

2. SUPER_ADMIN (primary user)
   - Edit a form via admin UI → `PATCH /work-permit/company/:companyId/:workPermitFormId` succeeds if linked to the company via `CompanyAdmin`.

3. Route correctness
   - Network tab shows:
     - Member: `PATCH /work-permit/<id>/submissions`
     - Admin : `PATCH /work-permit/company/<companyId>/<id>`

### Tips for next time

- Avoid broad param routes before specific ones. Use clear prefixes like `/company/...`.
- Keep backend routes and frontend service URLs in sync.
- For admin vs member, keep auth flows separate. Do not assume the same refresh for both.

### Files Touched

- Backend
  - `backend/routes/workPermitForm.routes.js` (route order + explicit admin path)
  - `backend/controllers/workPermitForm.controllers.js` (SUPER_ADMIN authorization)

- Frontend
  - `frontend/src/services/workPermit.service.js` (updated admin path)
  - `frontend/src/components/form/FormFiller.jsx` (edit flow)
  - `frontend/src/routes/company-member/dash/member.form-fill.$workPermitId.lazy.jsx` (prefill + choose create vs update)
  - `frontend/src/routes/company-member/dash/member.permits.lazy.jsx` (disable Fill after submission)
  - `frontend/src/api/axios.js` (interceptor tweaks)


