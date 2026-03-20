# Faith Mobile App

Faith is a workplace application designed to help organizations monitor staff activity, manage leave, and stay updated with company announcements. It provides employees, operations teams, and management with a clear view of daily work status and internal communications.

Built for modern workplaces, Faith simplifies staff-related processes such as attendance tracking, leave applications, and company updates, helping teams stay organized and informed throughout the day.

---

# Features

## Attendance Tracking

View daily attendance records including check-in and check-out times, work status and shift information. Monitor attendance history to stay aware of workforce activity (Operation).

## Leave Management

Submit and review leave applications easily. Track leave status, view approval progress and maintain visibility over leave history.

## Daythree Announcements

Receive important updates and announcements directly in the app so staff stay informed about company news, reminders and notices.

## Room and Resource Booking

Book and manage meeting rooms or shared office resources with a simple scheduling interface.

## Staff Profile and Information

Access staff information such as contact details, role, and profile information within the organization.

---

# System Features

## Secure Authentication

Token-based authentication ensures that only authorized staff can access workplace data. Sessions are automatically invalidated when tokens expire.

## Session Expiry Protection

Expired sessions are detected automatically. Users are notified and safely redirected to log in again.

## Network Connectivity Detection

The app detects online and offline states in real time. When offline, API requests are prevented and users are notified of connectivity issues.

## Offline Safety

Network guards prevent unnecessary requests when the device has no internet connection, protecting the app from crashes and failed operations.

## Centralized API Handling

All API requests are managed through a centralized interceptor layer, allowing consistent error handling, authentication checks, and network protection.

## Responsive Mobile Layout

UI components are designed to adapt across different screen sizes and device types for consistent usability.

## Smooth Navigation Experience

Optimized navigation ensures fast transitions between pages while maintaining state stability across the app.

## Global Loading and Overlay System

Global loaders, alerts, confirmations, and toasts provide consistent feedback to users during network requests and actions.

## Secure Token Storage

Authentication tokens are stored securely on the device using encrypted storage.

## Store-based State Management

Application state such as staff data, attendance, leave balances, announcements, and room bookings are managed through centralized stores for predictable updates.

---

Faith focuses on providing essential workplace tools in a simple and reliable mobile experience for daily staff operations.

# Faith Mobile App Release Flow

## 1. Finalized Development Build

- Complete development and bug fixes.
- Generate Android build (`.aab`) using Expo EAS.

**Estimated time:** ~10–20 minutes (cloud build)

---

## 2. Internal Testing (QA)

- Upload the build to **Internal Testing** in Google Play Console.
- Add QA team as testers.
- QA installs the app via the testing link and performs verification.

**Estimated time:**

- Deployment availability: ~5–15 minutes
- QA testing: ~1–2 days (depends on scope)

---

## 3. Closed Testing (Invited Users)

- Release the same build to **Closed Testing**.
- Add invited users (e.g., manager or selected staff).
- Testers install the app from the Play Store testing link.

**Estimated time:**

- Deployment availability: ~30 minutes – 2 hours
- User testing: ~1–3 days

---

## 4. Testing & Feedback

- QA and invited users test the app.
- Fix issues if any and upload updated builds if necessary.

**Estimated time:** ~1–3 days (depending on feedback and fixes)

---

## 5. Production Release

- Once testing is approved, create a **Production Release**.
- Submit the app to Google Play for review.

**Estimated time to submit:** ~10–15 minutes

---

## 6. Google Review & Publish

- Google reviews the submission.
- After approval, the app becomes available on the Play Store.

**Estimated review time:** ~1–3 days (sometimes faster)

Faith v1
├─ Test Case
│ ├─ Authentication
│ │ ├─ Login
│ │ │ ├─ Login - Valid Credentials
│ │ │ │ └─ Use valid credentials to verify successful login and redirect to dashboard
│ │ │ ├─ Login - Invalid Credentials
│ │ │ │ └─ Use invalid credentials to verify error message and blocked login
│ │ │ ├─ Login - Empty Input Validation
│ │ │ │ └─ Leave fields empty to verify required field validation is shown
│ │ │ ├─ Login - Password Visibility Toggle
│ │ │ │ └─ Toggle password visibility to verify input shows and hides correctly
│ │ │ ├─ Login - No Internet Handling
│ │ │ │ └─ Disable internet and attempt login to verify error handling
│ │ │ ├─ Login - Token Expiry Handling
│ │ │ │ └─ Use expired session to verify user is redirected to login
│ │ │ ├─ Login - Session Persistence
│ │ │ │ └─ Relaunch app with valid session to verify user remains logged in
│ │ │ ├─ Login - Loading Indicator
│ │ │ │ └─ Perform login to verify loading indicator is displayed during request
│ │ │ ├─ Login - Error Message Display
│ │ │ │ └─ Trigger login failure to verify correct error message is shown
│ │ │ └─ Login - Responsive Layout
│ │ │ └─ Test on different screen sizes to verify UI layout consistency
│ ├─ Attendance
│ │ ├─ Operation
│ │ │ ├─ Attendance - View Scheduled Shift
│ │ │ │ └─ Open attendance page to verify scheduled login and logout shift is displayed correctly
│ │ │ ├─ Attendance - Display Work Status
│ │ │ │ └─ View attendance screen to verify correct work status label is shown
│ │ │ ├─ Attendance - View Attendance History
│ │ │ │ └─ Navigate to history to verify past attendance records are displayed
│ │ │ ├─ Attendance - No Internet Handling
│ │ │ │ └─ Disable internet and access attendance to verify proper error handling
│ │ │ ├─ Attendance - Loading Indicator
│ │ │ │ └─ Load attendance page to verify loading indicator is shown during data fetch
│ │ │ └─ Attendance - Error Message Display
│ │ │ └─ Trigger API failure to verify error message is displayed
│ │ ├─ Management
│ │ │ ├─ Attendance - View Default Shift (9AM–6PM)
│ │ │ │ └─ Open attendance page to verify default shift (9AM–6PM) is displayed
│ │ │ ├─ Attendance - No Internet Handling
│ │ │ │ └─ Disable internet and access attendance to verify proper error handling
│ │ │ ├─ Attendance - Loading Indicator
│ │ │ │ └─ Load attendance page to verify loading indicator is shown during data fetch
│ │ │ └─ Attendance - Error Message Display
│ │ │ └─ Trigger API failure to verify error message is displayed
│ ├─ Leave Application
│ │ ├─ Overview
│ │ │ ├─ Leave - View Pending Applications
│ │ │ │ └─ Open leave page to verify pending applications are displayed correctly
│ │ │ ├─ Leave - View AL Balance
│ │ │ │ └─ View leave balance section to verify correct AL balance is shown
│ │ │ ├─ Leave - View Leave History
│ │ │ │ └─ Navigate to history to verify all past leave records are displayed
│ │ │ ├─ Leave - Empty State Display
│ │ │ │ └─ Use account with no data to verify empty state is shown correctly
│ │ │ ├─ Leave - Loading Indicator
│ │ │ │ └─ Load leave page to verify loading indicator is shown during data fetch
│ │ │ └─ Leave - Error Message Display
│ │ │ └─ Trigger API failure to verify error message is displayed
│ │ ├─ Application Form
│ │ │ ├─ Leave - Submit Application (Valid)
│ │ │ │ └─ Fill valid details and submit to verify application is successfully created
│ │ │ ├─ Leave - Required Field Validation
│ │ │ │ └─ Leave required fields empty and submit to verify validation messages
│ │ │ ├─ Leave - Leave Type Selection
│ │ │ │ └─ Select different leave types to verify correct options are shown
│ │ │ ├─ Leave - Conditional Fields
│ │ │ │ └─ Select leave types with conditions to verify additional fields appear
│ │ │ ├─ Leave - Date Selection
│ │ │ │ └─ Select start and end dates to verify correct date input handling
│ │ │ ├─ Leave - Invalid Date Range
│ │ │ │ └─ Select invalid date range to verify validation is triggered
│ │ │ ├─ Leave - Insufficient Balance
│ │ │ │ └─ Apply leave exceeding balance to verify restriction and message
│ │ │ ├─ Leave - Attachment Upload
│ │ │ │ └─ Upload attachment to verify file is accepted and attached
│ │ │ ├─ Leave - Submit with No Internet
│ │ │ │ └─ Disable internet and submit to verify error handling
│ │ │ ├─ Leave - Loading Indicator
│ │ │ │ └─ Submit application to verify loading indicator during request
│ │ │ └─ Leave - Error Message Display
│ │ │ └─ Trigger submission failure to verify error message is shown
│ │ ├─ Status
│ │ │ ├─ Leave - Status Display (Pending/Approved/Rejected)
│ │ │ │ └─ View leave list to verify correct status labels are displayed
│ │ │ ├─ Leave - Status Update Reflection
│ │ │ │ └─ Refresh or revisit page to verify updated status is reflected
│ │ │ └─ Leave - Cancel Application
│ │ │ └─ Cancel a pending application to verify it is updated accordingly
│ ├─ News Flash
│ │ ├─ Carousel
│ │ │ ├─ News Flash - Carousel Display
│ │ │ │ └─ Open home screen to verify news flash carousel items are displayed
│ │ │ ├─ News Flash - Carousel Auto Slide
│ │ │ │ └─ Observe carousel to verify items auto slide after interval
│ │ │ ├─ News Flash - Carousel Manual Swipe
│ │ │ │ └─ Swipe carousel manually to verify navigation between items
│ │ │ ├─ News Flash - Empty State Display
│ │ │ │ └─ Use no data scenario to verify empty state is shown
│ │ │ └─ News Flash - Loading Indicator
│ │ │ └─ Load page to verify loading indicator during fetch
│ │ ├─ Modal
│ │ │ ├─ News Flash - Open Detail Modal
│ │ │ │ └─ Tap on item to verify detail modal opens
│ │ │ ├─ News Flash - Display Content
│ │ │ │ └─ Open modal to verify full content is displayed correctly
│ │ │ ├─ News Flash - Close Modal
│ │ │ │ └─ Close modal to verify user returns to previous screen
│ │ │ ├─ News Flash - Acknowledge Item
│ │ │ │ └─ Acknowledge item to verify action is recorded
│ │ │ └─ News Flash - Acknowledge Status Update
│ │ │ └─ After acknowledge to verify item status updates accordingly
│ │ ├─ Listing
│ │ │ ├─ News Flash - View All Items
│ │ │ │ └─ Navigate to listing page to verify all items are displayed
│ │ │ ├─ News Flash - Unread Items on Top
│ │ │ │ └─ Open list to verify unread items are prioritized at top
│ │ │ ├─ News Flash - Read Items Ordering
│ │ │ │ └─ Verify read items are ordered correctly after unread items
│ │ │ ├─ News Flash - Empty State Display
│ │ │ │ └─ Use no data scenario to verify empty state is shown
│ │ │ ├─ News Flash - Pagination
│ │ │ │ └─ Scroll list to verify additional items are loaded
│ │ │ ├─ News Flash - Pull to Refresh
│ │ │ │ └─ Pull down to verify list refresh updates data
│ │ │ ├─ News Flash - Loading Indicator
│ │ │ │ └─ Load list to verify loading indicator is displayed
│ │ │ └─ News Flash - Error Message Display
│ │ │ └─ Trigger API failure to verify error message is shown
│ │ ├─ State
│ │ │ ├─ News Flash - Read/Unread Persistence
│ │ │ │ └─ Reopen app to verify read/unread state is maintained
│ │ │ ├─ News Flash - Sync After Acknowledge
│ │ │ │ └─ Acknowledge item to verify state sync across views
│ │ │ └─ News Flash - Data Consistency
│ │ │ └─ Refresh data to verify consistency across carousel and list
│ │ └─ Network
│ │ ├─ News Flash - No Internet Handling
│ │ │ └─ Disable internet to verify proper error handling
│ │ └─ News Flash - API Error Handling
│ │ └─ Simulate API error to verify error handling and messaging
│ ├─ Room Booking
│ │ ├─ Overview
│ │ │ ├─ Room Booking - View Active Bookings
│ │ │ │ └─ Open booking page to verify active bookings are displayed
│ │ │ ├─ Room Booking - View Past Booking Count
│ │ │ │ └─ View summary to verify past booking count is correct
│ │ │ ├─ Room Booking - Empty State Display
│ │ │ │ └─ Use no data scenario to verify empty state is shown
│ │ │ ├─ Room Booking - Loading Indicator
│ │ │ │ └─ Load page to verify loading indicator during data fetch
│ │ │ └─ Room Booking - Error Message Display
│ │ │ └─ Trigger API failure to verify error message is shown
│ │ ├─ Availability
│ │ │ ├─ Room Booking - Select Date
│ │ │ │ └─ Select a date to verify availability data is loaded correctly
│ │ │ ├─ Room Booking - View Available Slots
│ │ │ │ └─ Select date to verify available time slots are displayed
│ │ │ ├─ Room Booking - Availability Modal
│ │ │ │ └─ Open modal to verify availability details are shown
│ │ │ ├─ Room Booking - No Availability Handling
│ │ │ │ └─ Select fully booked date to verify no availability message
│ │ │ ├─ Room Booking - Refresh Availability
│ │ │ │ └─ Refresh or reselect date to verify updated availability
│ │ │ └─ Room Booking - Invalid Date Selection
│ │ │ └─ Select invalid date to verify validation handling
│ │ ├─ Booking Form
│ │ │ ├─ Room Booking - Submit Booking (Valid)
│ │ │ │ └─ Fill valid details and submit to verify booking is created
│ │ │ ├─ Room Booking - Required Field Validation
│ │ │ │ └─ Leave required fields empty to verify validation messages
│ │ │ ├─ Room Booking - Time Slot Selection
│ │ │ │ └─ Select time slot to verify correct selection is applied
│ │ │ ├─ Room Booking - Overlapping Booking Handling
│ │ │ │ └─ Select overlapping slot to verify restriction is enforced
│ │ │ ├─ Room Booking - Submit with No Internet
│ │ │ │ └─ Disable internet and submit to verify error handling
│ │ │ ├─ Room Booking - Loading Indicator
│ │ │ │ └─ Submit booking to verify loading indicator during request
│ │ │ └─ Room Booking - Error Message Display
│ │ │ └─ Trigger submission failure to verify error message is shown
│ │ ├─ Management
│ │ │ ├─ Room Booking - Booking Status Display
│ │ │ │ └─ View booking list to verify correct status is displayed
│ │ │ ├─ Room Booking - Withdraw Booking
│ │ │ │ └─ Withdraw active booking to verify action is processed
│ │ │ ├─ Room Booking - Withdraw Confirmation
│ │ │ │ └─ Trigger withdraw to verify confirmation prompt is shown
│ │ │ └─ Room Booking - Status Update After Withdraw
│ │ │ └─ Complete withdraw to verify status is updated accordingly
│ │ ├─ History
│ │ │ ├─ Room Booking - View Booking History
│ │ │ │ └─ Navigate to history to verify past bookings are listed
│ │ │ ├─ Room Booking - History Ordering
│ │ │ │ └─ Verify bookings are ordered correctly (latest first)
│ │ │ ├─ Room Booking - Pagination
│ │ │ │ └─ Scroll list to verify additional items are loaded
│ │ │ ├─ Room Booking - Pull to Refresh
│ │ │ │ └─ Pull down to verify list refresh updates data
│ │ │ ├─ Room Booking - Empty State Display
│ │ │ │ └─ Use no data scenario to verify empty state is shown
│ │ │ └─ Room Booking - Error Message Display
│ │ │ └─ Trigger API failure to verify error message is shown
│ │ └─ Network
│ │ ├─ Room Booking - No Internet Handling
│ │ │ └─ Disable internet to verify proper error handling
│ │ └─ Room Booking - API Error Handling
│ │ └─ Simulate API error to verify error handling and messaging
│ ├─ Settings
│ │ ├─ Overview
│ │ │ ├─ Settings - View Staff Details
│ │ │ │   └─ Open settings page to verify staff details are displayed correctly
│ │ │ ├─ Settings - Display Role Information
│ │ │ │   └─ View profile section to verify role information is shown correctly
│ │ │ ├─ Settings - Empty State Display
│ │ │ │   └─ Use no data scenario to verify empty state is shown
│ │ │ ├─ Settings - Loading Indicator
│ │ │ │   └─ Load settings page to verify loading indicator during data fetch
│ │ │ └─ Settings - Error Message Display
│ │ │     └─ Trigger API failure to verify error message is shown
│ │ ├─ Update
│ │ │ ├─ Settings - Edit Allowed Fields
│ │ │ │   └─ Modify editable fields to verify input is accepted
│ │ │ ├─ Settings - Field Validation
│ │ │ │   └─ Enter invalid data to verify validation messages are shown
│ │ │ ├─ Settings - Save Changes (Valid)
│ │ │ │   └─ Update valid data and save to verify changes are applied
│ │ │ ├─ Settings - Save Disabled Without Changes
│ │ │ │   └─ Make no changes to verify save action is disabled
│ │ │ ├─ Settings - Cancel Changes
│ │ │ │   └─ Modify fields and cancel to verify changes are not saved
│ │ │ ├─ Settings - Update Success Feedback
│ │ │ │   └─ Save changes to verify success message is displayed
│ │ │ ├─ Settings - Update Failure Handling
│ │ │ │   └─ Trigger update failure to verify error handling
│ │ │ ├─ Settings - Submit with No Internet
│ │ │ │   └─ Disable internet and save to verify error handling
│ │ │ └─ Settings - Loading Indicator
│ │ │     └─ Save changes to verify loading indicator during request
│ │ ├─ App Info
│ │ │ ├─ Settings - Display App Version
│ │ │ │   └─ Open app info to verify app version is displayed correctly
│ │ │ └─ Settings - Version Consistency
│ │ │     └─ Compare displayed version with build version to verify consistency
│ │ └─ State
│ │ ├─ Settings - Persist Updated Data
│ │ │   └─ Update profile and reopen app to verify data is persisted
│ │ └─ Settings - Refresh After Update
│ │     └─ Update data and refresh to verify latest data is reflected