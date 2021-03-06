import { Component } from "@angular/core";
import { Resume } from "./models/resume";
import { Experience } from "./models/experience";
import { Education } from "./models/education";
import { Skill } from "./models/skill";
import { ScriptService } from "./script.service";
declare let pdfMake: any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  resume = new Resume();
  degrees = ["Primary School", "Secondary School", "High School", "University"];

  constructor(private scriptService: ScriptService) {
    this.resume = JSON.parse(sessionStorage.getItem("resume")) || new Resume();
    if (!this.resume.experiences || this.resume.experiences.length === 0) {
      this.resume.experiences = [];
      this.resume.experiences.push(new Experience());
    }
    if (!this.resume.educations || this.resume.educations.length === 0) {
      this.resume.educations = [];
      this.resume.educations.push(new Education());
    }
    if (!this.resume.skills || this.resume.skills.length === 0) {
      this.resume.skills = [];
      this.resume.skills.push(new Skill());
    }

    console.log("Loading External Scripts");
    this.scriptService.load("pdfMake", "vfsFonts");
  }

  addExperience() {
    this.resume.experiences.push(new Experience());
  }

  addEducation() {
    this.resume.educations.push(new Education());
  }

  generatePdf(action = "open") {
    console.log(pdfMake);
    const documentDefinition = this.getDocumentDefinition();
    switch (action) {
      case "open":
        pdfMake.createPdf(documentDefinition).open();
        break;
      case "print":
        pdfMake.createPdf(documentDefinition).print();
        break;
      case "download":
        pdfMake.createPdf(documentDefinition).download();
        break;
      default:
        pdfMake.createPdf(documentDefinition).open();
        break;
    }
  }

  resetForm() {
    this.resume = new Resume();
  }

  getDocumentDefinition() {
    sessionStorage.setItem("resume", JSON.stringify(this.resume));
    return {
      content: [
        {
          columns: [
            {
              width: 130,
              table: {
                widths: [100],
                body: [
                  [[this.getProfilePicObject()]],
                  [
                    {
                      text: "Name : ",
                      style: "name",
                      color: "#ff6666",
                    },
                  ],
                  [
                    {
                      text: this.resume.name,
                      margin: [15, 0, 0, 0],
                    },
                  ],
                  [
                    {
                      text: "Address : ",
                      style: "name",
                      color: "#ff6666",
                    },
                  ],
                  [
                    {
                      text: this.resume.address,
                      margin: [15, 0, 0, 0],
                    },
                  ],
                  [
                    {
                      text: "Contant No : ",
                      style: "name",
                      color: "#ff6666",
                    },
                  ],
                  [
                    {
                      text: this.resume.contactNo,
                      margin: [15, 0, 0, 0],
                    },
                  ],
                  [
                    {
                      text: "Email : ",
                      style: "name",
                      color: "#ff6666",
                    },
                  ],
                  [
                    {
                      text: this.resume.email,
                      link: this.resume.email,
                      decoration: "underline",
                      margin: [15, 0, 0, 0],
                    },
                  ],
                  [
                    {
                      text: "GitHub: ",
                      style: "name",
                      color: "#ff6666",
                    },
                  ],
                  [
                    {
                      text: this.resume.socialProfile,
                      link: this.resume.socialProfile,
                      decoration: "underline",
                      margin: [15, 0, 0, 0],
                    },
                  ],
                ],
              },
            },
            [
              {
                text: "Skills",
                style: "header",
              },
              {
                columns: [
                  {
                    ul: [
                      ...this.resume.skills
                        .filter((value, index) => index % 3 === 0)
                        .map((skills) => skills.value),
                    ],
                  },
                  {
                    ul: [
                      ...this.resume.skills
                        .filter((value, index) => index % 3 === 1)
                        .map((skills) => skills.value),
                    ],
                  },
                  {
                    ul: [
                      ...this.resume.skills
                        .filter((value, index) => index % 3 === 2)
                        .map((skills) => skills.value),
                    ],
                  },
                ],
              },
              {
                text: "Experience",
                style: "header",
              },
              this.getExperienceObject(this.resume.experiences),

              {
                text: "Education",
                style: "header",
              },
              this.getEducationObject(this.resume.educations),
              {
                text: "Other Details",
                style: "header",
              },
              {
                text: this.resume.otherDetails,
              },
            ],
          ],
        },
        {
          text: "Signature",
          style: "sign",
        },
        {
          columns: [
            {
              qr:
                "Name: " +
                this.resume.name +
                "\n" +
                "Contact No: " +
                this.resume.contactNo +
                "\n" +
                "Mail: " +
                this.resume.email +
                "\n" +
                "Social: " +
                this.resume.socialProfile +
                "\n",
              fit: 100,
            },
            {
              text: `(${this.resume.name})`,
              alignment: "right",
            },
          ],
        },
      ],
      info: {
        title: this.resume.name + "_RESUME",
        author: this.resume.name,
        subject: "RESUME",
        keywords: "RESUME, ONLINE RESUME",
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: "underline",
          color: "#8888ff",
        },
        name: {
          fontSize: 16,
          bold: true,
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true,
        },
        sign: {
          margin: [0, 50, 0, 10],
          alignment: "right",
          italics: true,
        },
        tableHeader: {
          bold: true,
        },
      },
    };
  }

  getExperienceObject(experiences: Experience[]) {
    const exs = [];

    experiences.forEach((experience) => {
      exs.push([
        {
          columns: [
            [
              {
                text: experience.jobTitle,
                style: "jobTitle",
              },
              {
                text: experience.employer,
              },
              {
                text: experience.jobDescription,
              },
            ],
            {
              text: "Experience : " + experience.experience + " Months",
              alignment: "right",
            },
          ],
        },
      ]);
    });
    return {
      table: {
        widths: [390],
        body: [...exs],
      },
    };
  }

  getEducationObject(educations: Education[]) {
    return {
      table: {
        widths: [90, 90, 90, 90],
        body: [
          [
            {
              text: "Degree",
              style: "tableHeader",
            },
            {
              text: "College",
              style: "tableHeader",
            },
            {
              text: "Passing Year",
              style: "tableHeader",
            },
            {
              text: "Result",
              style: "tableHeader",
            },
          ],
          ...educations.map((ed) => {
            return [ed.degree, ed.college, ed.passingYear, ed.percentage];
          }),
        ],
      },
    };
  }

  getProfilePicObject() {
    if (this.resume.profilePic) {
      return {
        image: this.resume.profilePic,
        width: 75,
        alignment: "right",
      };
    }
    return null;
  }

  fileChanged(e) {
    const file = e.target.files[0];
    this.getBase64(file);
  }

  //commands for selecting pictures
  getBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      this.resume.profilePic = reader.result as string;
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  }

  addSkill() {
    this.resume.skills.push(new Skill());
  }

  deleteSkill(index) {
    this.resume.skills.splice(index);
  }

  deleteEducation(index) {
    this.resume.educations.splice(index);
  }

  deleteExperience(index) {
    this.resume.experiences.splice(index);
  }
}
