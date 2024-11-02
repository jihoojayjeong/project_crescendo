Certainly, 정지후님! 아래는 제공해 주신 내용을 바탕으로 영어로 작성된 개발자 친화적인 README.md 파일입니다. 제목, 섹션 구분, 리스트, 코드 블록, 그리고 이모지를 사용하여 가독성을 높였습니다.

🚀 Crescendo Research Project

📚 Table of Contents

	•	Project Description
	•	Technical Stack
	•	Motivation
	•	Challenges with Peer Assessment
	•	PI’s Teaching Practice to Address the Problem
	•	🌟 Peer-Review Feedback System
	•	📈 Key Benefits
	•	🚢 Deployment Instructions
	•	⚠️ Important
	•	🔧 How to Build and Deploy
	•	📦 Docker and CI/CD Automation
	•	👤 Dummy User Data

📄 Project Description

The Crescendo Research Project aims to enhance project-based learning outcomes through innovative peer-review systems and optimized deployment processes. This project integrates modern technologies and pedagogical strategies to foster a collaborative and efficient learning environment.

🛠️ Technical Stack

	•	Backend: Node.js, Express
	•	Frontend: React
	•	Database: MongoDB (NoSQL)
	•	Server: Nginx
	•	Containerization: Docker

🎯 Motivation

Many undergraduate courses, especially senior-level courses, incorporate project-based learning. For example, the Computer Science department at Virginia Tech (VT) offers numerous capstone courses designed to synthesize and integrate skills and knowledge acquired throughout the CS undergraduate curriculum. These courses emphasize significant design experiences, where teamwork and written and oral communication are key components.

In such project-based courses, professors typically require milestone presentations to monitor progress, provide feedback, and allow students to observe the advancements of other teams. Feedback from these presentations can help teams generate ideas for improving their projects and achieving successful final outcomes.

🛡️ Challenges with Peer Assessment

While peer assessment can lead to positive learning outcomes, it also presents several challenges:

	•	Inconsistent Grading: Individual grading standards may vary across students.
	•	Potential for Gaming the System: Some students might manipulate assessments to favor their own grades.
	•	Low Participation: Instructors may face difficulties in eliciting participation from all students.
	•	Comfort Levels: Students may feel uncomfortable allowing peers to influence their grades.

💡 PI’s Teaching Practice to Address the Problem

🌟 Peer-Review Feedback System

Professor Lee developed and implemented a novel peer-review feedback system in his Creative Computing Studio capstone course, which he has taught four times. The system operates as follows:

	1.	Providing Feedback:
	•	After each group presentation, students provide feedback to the presenting teams.
	•	Feedback is collected via an online survey with three sections:
	•	I like (Positives)
	•	I wish (Improvements)
	•	What if (Suggestions)
	2.	Evaluating Feedback:
	•	Presenting teams evaluate the quality of the received feedback based on criteria such as:
	•	Specificity
	•	Justification
	•	Actionability
	•	Positivity
	3.	Grading:
	•	Each student receives grades from nine different teams, contributing to their final assignment grade (5% of the course grade).

This crowdsourced peer-review system has been refined over four iterations and is now consistently used in the course.

📈 Key Benefits

	•	Constructive Feedback: Students are motivated to provide meaningful feedback as it directly impacts their grades.
	•	Crowdsourced Insights: Teams receive valuable feedback with consistent themes, enhancing the credibility and usefulness of the input.
	•	Community Building: Regular feedback fosters a collaborative environment, allowing students to witness each team’s progress and development over the semester.

🚢 Deployment Instructions

⚠️ Important

DO NOT DEPLOY ON ANY BRANCH OTHER THAN MASTER! Deployment using GitHub Actions is restricted due to domain limitations. Instead, use the deploy.sh script to deploy the backend server.

🔧 How to Build and Deploy

	1.	Run the Deployment Script:

bash deploy.sh


	2.	Provide Server Details When Prompted:
	•	Server IP Address
	•	Username
	•	Password
	3.	Access the Website:
	•	After deployment, access the website via the provided public IP address.

📦 Docker and CI/CD Automation

We optimized the deployment process using Docker, achieving significant improvements:

	•	Deployment Time: Reduced by 50%
	•	CPU Usage: Reduced by 95%
	•	System Call Time: Reduced by 71%

A custom CI/CD pipeline automates the deployment process, cutting deployment time by 60% and minimizing human errors during production releases.

👤 Dummy User Data

To generate dummy user data, use the scripts/seed.js file.

Steps to Run the Script:

	1.	Run the Seed Users Script:

node scripts/seedUsers.js


	2.	Add Users to a Course:

node scripts/addUsersToCourse.js

	•	Ensure to input the correct courseId.

	3.	Access the Website:
	•	After running the scripts, access the website via the public IP address.

📌 Additional Notes

	•	Environment Variables:
	•	Ensure all necessary environment variables are set in the .env.development file.
	•	Example:

MONGO_URI_PROD=your_production_mongo_uri
MONGO_URI=mongodb://localhost:27017/crescendo


	•	Common Issues:
	•	If you encounter the following error during npm start:

TypeError: Router.use() requires a middleware function

	•	Solution: Ensure that all middleware functions are correctly imported and that router files export valid middleware functions.

📝 License

This project is licensed under the MIT License.

🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

📧 Contact

For any inquiries or issues, please contact your.email@example.com.

Feel free to customize any sections further to better fit your project’s specifics. If you have any additional content or need further customization, let me know!
