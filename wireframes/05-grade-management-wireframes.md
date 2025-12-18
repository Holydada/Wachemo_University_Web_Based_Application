# Grade & Teacher Management Wireframes

## 1. Teacher Grade Entry Interface

```
+----------------------------------------------------------+
|  [WCU Logo] Wachemo University    [Profile] [Logout]    |
+----------------------------------------------------------+
| Grade Management | CS301 - Data Structures             |
+----------------------------------------------------------+
|                                                          |
| Course: CS301 - Data Structures | Semester: 2nd, 2024/25|
| Instructor: Dr. Ahmed Ali | Students: 45                |
|                                                          |
| Grade Entry:                                             |
|                                                          |
| +------------------------------------------------------+ |
| | Student ID | Name           | Midterm | Final | Total | |
| |            |                | /40     | /60   | /100  | |
| +------------------------------------------------------+ |
| | WCU/001234 | Abebe Kebede   | [35]    | [52]  | 87    | |
| | WCU/001235 | Meron Tadesse  | [38]    | [55]  | 93    | |
| | WCU/001236 | Dawit Haile    | [32]    | [48]  | 80    | |
| | WCU/001237 | Sara Mohammed  | [40]    | [58]  | 98    | |
| | WCU/001238 | Yonas Girma    | [28]    | [42]  | 70    | |
| +------------------------------------------------------+ |
|                                                          |
| Grade Statistics:                                        |
| Average: 85.6 | Highest: 98 | Lowest: 70               |
| Pass Rate: 100% (45/45) | Grade Distribution:          |
| A: 12 | B: 18 | C: 15 | D: 0 | F: 0                     |
|                                                          |
| Grade Validation:                                        |
| ✓ All grades entered                                     |
| ✓ No invalid scores                                      |
| ✓ Grade distribution normal                              |
| ⚠ 3 students below department average                    |
|                                                          |
| Submission Status: Draft                                 |
| Last Saved: 2 minutes ago                               |
|                                                          |
| [Save Draft] [Preview Report] [Submit to Department]    |
+----------------------------------------------------------+
```

## 2. Grade Approval Workflow

```
+----------------------------------------------------------+
|  [WCU Logo] Wachemo University    [Profile] [Logout]    |
+----------------------------------------------------------+
| Grade Approval | Department Head Dashboard               |
+----------------------------------------------------------+
|                                                          |
| Pending Grade Submissions:                               |
|                                                          |
| +------------------------------------------------------+ |
| | CS301 - Data Structures                              | |
| | Instructor: Dr. Ahmed Ali                            | |
| | Students: 45 | Submitted: Jan 24, 2025               | |
| | Status: Pending Department Approval                  | |
| | [Review Grades] [Approve] [Request Changes]          | |
| +------------------------------------------------------+ |
|                                                          |
| +------------------------------------------------------+ |
| | MATH201 - Calculus II                               | |
| | Instructor: Dr. Meron Tadesse                        | |
| | Students: 52 | Submitted: Jan 23, 2025               | |
| | Status: Approved by Department                       | |
| | Next: College Approval                               | |
| | [View Details] [Send to College]                     | |
| +------------------------------------------------------+ |
|                                                          |
| +------------------------------------------------------+ |
| | CS205 - Programming II                               | |
| | Instructor: Dr. Sara Mohammed                        | |
| | Students: 38 | Submitted: Jan 22, 2025               | |
| | Status: Returned for Revision                        | |
| | Issue: Grade distribution concerns                   | |
| | [View Comments] [Review Resubmission]                | |
| +------------------------------------------------------+ |
|                                                          |
| Approval Statistics:                                     |
| This Month: 23 Approved | 5 Pending | 2 Returned       |
| Average Processing Time: 2.3 days                       |
|                                                          |
| Grade Issues Detected:                                   |
| +------------------------------------------------------+ |
| | • Student WCU/001456 enrolled in CS301 without      | |
| |   completing CS201 prerequisite                      | |
| | • Grade distribution in PHYS201 shows 85% failures  | |
| | • Missing grades for 3 students in CHEM101          | |
| +------------------------------------------------------+ |
|                                                          |
| [Generate Report] [Send Notifications] [View Calendar]  |
+----------------------------------------------------------+
```

## 3. Student Grade Report

```
+----------------------------------------------------------+
|  [WCU Logo] Wachemo University    [Profile] [Logout]    |
+----------------------------------------------------------+
| Academic Records | Grade Report                         |
+----------------------------------------------------------+
|                                                          |
| Student: Abebe Kebede | ID: WCU/2024/001234             |
| Department: Computer Science | Year: 2nd                |
| Semester: 2nd Semester, 2024/25                         |
|                                                          |
| Current Semester Grades:                                 |
|                                                          |
| +------------------------------------------------------+ |
| | Course Code | Course Title        | Credit | Grade   | |
| |             |                     | Hours  | Points  | |
| +------------------------------------------------------+ |
| | CS301       | Data Structures     | 4      | A (87)  | |
| | CS302       | Database Systems    | 3      | B+ (85) | |
| | MATH201     | Calculus II         | 4      | B (78)  | |
| | ENG201      | Technical Writing   | 2      | A- (90) | |
| | PHIL101     | Logic & Ethics      | 2      | B+ (82) | |
| +------------------------------------------------------+ |
|                                                          |
| Semester Summary:                                        |
| Total Credit Hours: 15                                   |
| Semester GPA: 3.47                                       |
| Cumulative Credit Hours: 45                              |
| Cumulative GPA: 3.45                                     |
|                                                          |
| Academic Standing: Good Standing                         |
| Next Semester Eligibility: Eligible                     |
|                                                          |
| Grade History:                                           |
| +------------------------------------------------------+ |
| | Semester 1, 2024/25 | GPA: 3.42 | Credits: 15        | |
| | Semester 2, 2023/24 | GPA: 3.48 | Credits: 15        | |
| | Semester 1, 2023/24 | GPA: 3.45 | Credits: 15        | |
| +------------------------------------------------------+ |
|                                                          |
| Degree Progress:                                         |
| Completed: 45/120 Credit Hours (37.5%)                  |
| Expected Graduation: June 2026                           |
|                                                          |
| [Download PDF] [Print Report] [Request Transcript]      |
+----------------------------------------------------------+
```

## 4. Prerequisite Checking System

```
+----------------------------------------------------------+
|  [WCU Logo] Wachemo University                          |
+----------------------------------------------------------+
| Prerequisite Validation | Registration Check            |
+----------------------------------------------------------+
|                                                          |
| Student: Abebe Kebede | ID: WCU/2024/001234             |
| Attempting to Register for: CS401 - Software Engineering|
|                                                          |
| Prerequisite Analysis:                                   |
|                                                          |
| +------------------------------------------------------+ |
| | Required Prerequisites for CS401:                   | |
| |                                                      | |
| | ✓ CS301 - Data Structures (Grade: A, Completed)     | |
| | ✓ CS302 - Database Systems (Grade: B+, Completed)   | |
| | ✗ CS303 - Algorithms (Not Completed)                | |
| | ✓ MATH201 - Calculus II (Grade: B, Completed)       | |
| +------------------------------------------------------+ |
|                                                          |
| Validation Result: FAILED                                |
| Missing Prerequisites: 1                                 |
|                                                          |
| +------------------------------------------------------+ |
| | CS303 - Algorithms                                   | |
| | Status: Not Completed                                | |
| | Available: Next Semester (Semester 1, 2025/26)      | |
| | Prerequisite for CS303: CS301 (✓ Completed)         | |
| | Recommended Action: Register for CS303 first        | |
| +------------------------------------------------------+ |
|                                                          |
| Alternative Courses Available:                           |
| +------------------------------------------------------+ |
| | CS305 - Web Development                              | |
| | Prerequisites: CS201, CS202 (✓ All Met)             | |
| | Credits: 3 | Instructor: Dr. Meron Tadesse           | |
| | [Register for This Course]                           | |
| +------------------------------------------------------+ |
|                                                          |
| +------------------------------------------------------+ |
| | CS306 - Mobile App Development                       | |
| | Prerequisites: CS301 (✓ Met)                         | |
| | Credits: 3 | Instructor: Dr. Sara Mohammed            | |
| | [Register for This Course]                           | |
| +------------------------------------------------------+ |
|                                                          |
| Academic Advisor Notification Sent                      |
| Recommended Meeting: Schedule appointment to discuss     |
| course planning and prerequisite completion strategy.    |
|                                                          |
|                    [Back to Registration] [Contact Advisor]|
+----------------------------------------------------------+
```

## 5. Grade Analytics Dashboard

```
+----------------------------------------------------------+
|  [WCU Logo] Wachemo University    [Profile] [Logout]    |
+----------------------------------------------------------+
| Analytics | Department Performance Overview              |
+----------------------------------------------------------+
|                                                          |
| Computer Science Department | Semester 2, 2024/25       |
|                                                          |
| Overall Statistics:                                      |
| +----------------+ +----------------+ +----------------+ |
| | Total Students | | Average GPA    | | Pass Rate      | |
| | 456            | | 3.24           | | 94.2%          | |
| | [View Details] | | [Trend Analysis]| | [View Failed]  | |
| +----------------+ +----------------+ +----------------+ |
|                                                          |
| Course Performance:                                      |
|                                                          |
| +------------------------------------------------------+ |
| | Course    | Students | Avg Grade | Pass Rate | Issues| |
| +------------------------------------------------------+ |
| | CS101     | 89       | 3.45      | 96%       | None  | |
| | CS201     | 67       | 3.12      | 91%       | Low   | |
| | CS301     | 45       | 3.67      | 100%      | None  | |
| | CS401     | 34       | 2.89      | 85%       | High  | |
| | CS501     | 23       | 3.23      | 95%       | None  | |
| +------------------------------------------------------+ |
|                                                          |
| Grade Distribution:                                      |
| [Chart showing A: 25%, B: 35%, C: 25%, D: 10%, F: 5%]  |
|                                                          |
| Trending Issues:                                         |
| +------------------------------------------------------+ |
| | • CS401 showing declining performance (3 semesters) | |
| | • Prerequisite violations increased by 15%          | |
| | • Late grade submissions up 20% this semester       | |
| | • Student complaints about CS201 difficulty         | |
| +------------------------------------------------------+ |
|                                                          |
| Faculty Performance:                                     |
| +------------------------------------------------------+ |
| | Dr. Ahmed Ali    | 4 Courses | Avg: 3.45 | On Time  | |
| | Dr. Meron Tadesse| 3 Courses | Avg: 3.12 | 2 Days Late| |
| | Dr. Sara Mohammed| 2 Courses | Avg: 3.67 | On Time  | |
| +------------------------------------------------------+ |
|                                                          |
| [Generate Report] [Export Data] [Schedule Meeting]      |
+----------------------------------------------------------+
```