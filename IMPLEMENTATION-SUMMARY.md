# Test Case Simplification - Implementation Summary

## Overview
Successfully refactored the system to simplify test case creation by removing the tight coupling between scenarios and personas. Test cases are now persona-independent and can be run against any persona(s) at runtime.

## Changes Made

### 1. Type System Updates
**File:** `types/index.ts`
- Made `scenarioId` optional in `TestScript` for backward compatibility
- Added `goal` and `expectedOutcome` fields to `TestScript` and `DbTestScript`

### 2. Database Transforms
**File:** `lib/db-transforms.ts`
- Updated `dbToTestScript()` and `testScriptToDb()` to handle new fields

### 3. API Endpoints

#### New Endpoint - Test Case Suggestions
**File:** `app/api/projects/[id]/scripts/suggestions/route.ts`
- POST endpoint that generates AI suggestions for scenario/goal/expected outcome
- Uses project's agent config as context
- Returns pre-filled values for the modal

#### Updated - Test Case Creation
**File:** `app/api/projects/[id]/scripts/route.ts`
- Changed to accept `goal` and `expectedOutcome` instead of requiring `scenarioId`
- Made `scenarioId` optional for backward compatibility
- Sets status to 'Approved' by default (auto-approve)

#### Updated - AI Generation
**File:** `app/api/projects/[id]/scripts/generate/route.ts`
- Changed to accept `{ scenario, goal, expectedOutcome }` instead of `scenarioId`
- Generates persona-agnostic discussion guides
- Auto-approves created test cases

### 4. React Hooks
**File:** `hooks/use-scripts.ts`
- Added `useTestCaseSuggestions()` hook for getting AI suggestions
- Updated `useGenerateTestScript()` to accept new parameters

### 5. UI Components

#### New Component - Test Case Creator Modal
**File:** `components/test-cases/test-case-creator-modal.tsx`
- Modal with 3 editable text fields (Scenario, Goal, Expected Outcome)
- Auto-loads AI-generated suggestions on open
- User can edit suggestions before submitting
- Creates test case directly (no separate approval step)

#### Updated - Scripts Page
**File:** `app/projects/[id]/scripts/page.tsx`
- Renamed from "Test Scripts" to "Test Cases" throughout UI
- Removed scenario selection dropdown
- Added "Create Test Case" button
- Removed dependencies on scenarios and personas hooks
- Updated table columns:
  - Removed: Scenario, Persona, Turns, Status
  - Added: Scenario (name), Goal, Expected Outcome
- Removed approval workflow (test cases are auto-approved)
- Updated detail sheet to show goal and expected outcome

## Database Migration Required

**File:** `migration-add-test-case-fields.sql`

Run this SQL in your Supabase SQL editor:

```sql
-- Add goal and expected_outcome columns
ALTER TABLE test_scripts
ADD COLUMN IF NOT EXISTS goal TEXT,
ADD COLUMN IF NOT EXISTS expected_outcome TEXT;

-- Make scenario_id optional
ALTER TABLE test_scripts
ALTER COLUMN scenario_id DROP NOT NULL;

-- Update existing records
UPDATE test_scripts
SET goal = 'Legacy test case',
    expected_outcome = 'Legacy test case'
WHERE goal IS NULL OR expected_outcome IS NULL;

-- Make new columns required
ALTER TABLE test_scripts
ALTER COLUMN goal SET NOT NULL,
ALTER COLUMN expected_outcome SET NOT NULL;
```

## Next Steps

### 1. Run Database Migration
Execute the SQL in `migration-add-test-case-fields.sql` in your Supabase SQL editor.

### 2. Update Test Execution (TODO)
The test runner still needs to be updated to:
- Remove scenario/persona lookup when running tests
- Accept `testCaseIds[]` + `personaIds[]` as parameters
- Run all combinations of selected test cases × personas
- Store the persona_id directly in test_results (already supported)

**Files to update:**
- `lib/test-execution/runner.ts` - Update `executeTestScript()` to use test case goal/expectedOutcome instead of looking up scenario
- Test run UI - Add persona selection when creating test runs

### 3. Optional - Remove Scenarios UI
If you want to fully remove scenarios from the UI:
- Remove scenarios navigation/tab from project layout
- Keep scenarios API/data for historical test runs

## Backward Compatibility
- Old test runs with scenario references will continue to work
- `scenarioId` is now optional in test_scripts table
- All new test cases won't have a scenario_id (will be null)

## Testing Checklist
- [ ] Run database migration
- [ ] Test creating a new test case (modal should show AI suggestions)
- [ ] Verify test case appears in the table with goal and expected outcome
- [ ] Test viewing test case details
- [ ] Test deleting a test case
- [ ] Update test runner to accept persona selection
- [ ] Test running a test case with multiple personas

## User Experience Flow

### Creating a Test Case
1. User clicks "Create Test Case" button
2. Modal opens, AI generates suggestions (auto-fills 3 fields)
3. User edits any field as needed
4. User clicks "Create Test Case"
5. AI generates discussion guide based on inputs
6. Test case appears immediately in list (auto-approved)

### Running Tests (To Be Implemented)
1. User selects one or more test cases
2. User selects one or more personas to test with
3. System runs all combinations (e.g., 2 test cases × 3 personas = 6 test runs)
4. Results are linked to both test case and persona
