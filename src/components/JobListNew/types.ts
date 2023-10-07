// types.ts


export interface Filters {
    region: string[];
    jobType: string[];
    positionType: string[];
    companyType: string[];
    companyName: string;
}

export type FilterOption = {
    key: string;
    name: string;
};

export type FilterKey = Exclude<keyof Filters, 'companyName'>;

export interface JobRequest {
    companyName?: string;
    limit?: string;
    nation?: string;
    noFeedback?: string;
    page?: string;
    publishCompany?: string;
    targetGroup?: string;
    type?: string;
    [property: string]: any;
}

export interface JobResponse {
    code: number;
    data: JobData;
    message: string;
    [property: string]: any;
}

export interface JobData {
    jobDateTable: JobDate[];
    jobList: Job[];
    pageInfo: PageInfo;
    selectInfo: SelectInfo;
    textInfo: TextInfo;
    [property: string]: any;
}

export interface JobDate {
    date: string;
    num: number;
    [property: string]: any;
}

export interface Job {
    company: string;
    date: string;
    id: number;
    jobTitle: string;
    jobFeedback: string;
    jobLink: string;
    nation: string;
    targetGroup: string;
    type: string;
    [property: string]: any;
}

export interface PageInfo {
    count: number;
    limit: string;
    page: string;
    [property: string]: any;
}

export interface SelectInfo {
    companyName: string;
    nation: string;
    noFeedback: string;
    publishCompany: string;
    targetGroup: string;
    type: string;
    [property: string]: any;
}

export interface TextInfo {
    [key: string]: TextInfoItem;
}

export interface TextInfoItem {
    link: string;
    text: string;
    [property: string]: any;
}

export interface JobListItem {
    company: string;
    date: string;
    id: number;
    job: string;
    job_feedback: string;
    job_link: string;
    nation: string;
    target_group: string;
    type: string;
    // 其他可能的属性...
}
