// @ts-nocheck
'use client';
import ADRow from '@/components/ADRow';
import JobList from '@/components/JobListNew/JobList';
import React from 'react';

const JobsPage = (props: any) => {
  const { searchParams: { pageId, infoId } } = props;
  return (

    <div className="mainContainer">
      <ADRow menuId={pageId} />
      <div className='mt-[30px]'></div>
      <div className='bg-[#f5f5f7] p-10 mt-[10px] mb-[20px]'>
        <strong className='text-3xl'>Hao Offer帮你追踪最新职位</strong>
        <div className='w-full my-[15px]' style={{
          borderBottom: '1px dashed #444'
        }}></div>
        <strong className='text-xl text-[#444444] block'>美国地区 SDE NewGrad （秋招已经正式开始，已发布多个24年New Grad职位）</strong>
        <strong className='text-xl text-[#444444] block'>2022年共收录 SDE NG职位775个</strong>
        <strong className='text-xl text-[#444444] block'>建议：找NG的同学，Entry-Level也可一起投递</strong>
      </div>
      <JobList showCahrt={true} showOnline={true} infoId={infoId} />
    </div>


  );
};

export default JobsPage;
