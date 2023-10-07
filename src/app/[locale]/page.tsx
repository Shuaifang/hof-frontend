"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { fetchIndexData } from '@/utils/api/global';
import ADRow from '@/components/ADRow';

const CtaList = (props:any) => {
  const data:any = props.data;
  return (
    <div className="container mx-auto p-4">
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
          {data?.jobs_display.infoList.map((cta: { link: string | undefined; img: any; nation: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; type: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
            <a
              key={index}
              href={cta.link}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-block relative p-0 rounded-md overflow-hidden"
            >
              <div
                className="w-[100%] h-[131px] inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${cta.img})` }}
              ></div>

              <div className="relative  z-10 text-center bg-[#f7f7f7] h-[220px] pt-[40px] pb-[30px]">
                <h2 className="text-gray text-2xl mb-4">{cta.nation}</h2>
                <h2 className="text-gray text-2xl mb-4">{cta.type}职位</h2>
                <p className="text-gray">每日更新</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

const Page = () => {
  const [data, setData] = useState(null);
  const fetchData = async () => {
    const result = await fetchIndexData();
    setData(result.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <CtaList data={data} />
      <ADRow menuId={1}></ADRow>
    </section>
  );
};

export default Page;
