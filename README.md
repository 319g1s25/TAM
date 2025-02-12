# ***TA Management System***
## __Description__
***TA Management System*** is a web-based platform designed to streamline the management of __Teaching Assistants (TA's)__ in the university. It automates workload distribution, proctoring assignments, leave management, and reporting to enhance efficiency.
## __Drawbacks of Existing System__
* No centralized system for tracking TA workloads.
* Manual proctoring assignment leads to unfair workload distribution.
* Lack of automation in leave approvals and TA reporting.
* No system to manage proctor swaps effectively.
## __Goals__
* Ensure fair and __data-driven workload distribution__ among TA's.
* Automate proctoring assignment based on workload and priorities.
* Simplify TA leave management with an approval workflow.
* Provide real-time reporting and tracking of TA activities.
* Improve __user engagement__ with automated notifications and role-based dashboards.
## __Features__
### __Role-Based Access__
* TA's, Faculties, Department Staff, and Administrators have different access levels.
* Secure authentication to protect sensitive data.
### __TA Duty Management__
* TA's log tasks (lab work, grading, office hours, etc.).
* Course instructors approve or reject submissions.
* Approved tasks contribute to the __total workload__ of the TA.
### __Proctoring Assignment__
* __Automatic Assignment:__ Assigns TAs with the least workload along with other constraints that were specified.
* __Manual Assignment:__ Faculty can override and assign manually.
* __Proctoring Restrictions:__
  * Only PhD students can proctor MS/PhD courses.
  * TA's on leave or taking the course cannot be assigned.
### __TA Leave Management__
* TAs submit leave requests (medical, conference, etc.).
* Department chairs/staff approve or rejects requests.
* Approved leave blocks proctoring assignments.
### __Proctor Swap System__
* __TA-Initiated:__ A TA can request a swap with another TA.
* __Staff-Initiated:__ Authorized staff can replace an assigned TA.
* __Notifications:__ All parties receive email alerts upon approval.
### __Classroom and Exam Management__
* Generate __student distribution lists__ (alphabetically/randomly).
* __Dean’s Office Control:__ Assign TAs across departments for major exams.
### __Reports and Logs__
* __Workload Reports:__ Track total hours per TA, course, or semester.
* __System Logs:__ Log all actions (logins, assignments, swaps, etc.).
* __Export Reports__ to __PDF/Excel__ for easy data analysis.
## __System Requirements__
* __Operating System:__ Linux
* __Web Server:__ Apache2
* __Database:__ MySQL
# 🌜 __Team Members__
21902874 - Ömer Yaslıtaş\
21902958 - Melih Rıza Yıldız\
21903609 - Aykhan Ahmadzada\
22102033 - Alper Yıldırım\
22202673 - Emre Algür\
22201570 - Irmak İmdat
