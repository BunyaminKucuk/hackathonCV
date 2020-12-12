import {Experience} from './experience'
import {Education} from './education'
import {Skill} from './skill'

export class Resume {
    profilePic: string;
    name: string;
    address: string;
    contactNo: number;
    email: string;
    socialProfile: string;
    experiences: Experience[] = [];
    educations: Education[] = [];
    otherDetails: string;
    skills: Skill[] = [];

    constructor() {
        this.experiences.push(new Experience());
        this.educations.push(new Education());
        this.skills.push(new Skill());
    }
}






