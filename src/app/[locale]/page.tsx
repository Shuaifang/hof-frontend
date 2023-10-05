"use client";
import { useEffect, useState } from 'react';
import { fetchIndexData } from '@/utils/api/global';
export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchIndexData();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div>{JSON.stringify(data)}</div>
    </section>
  );
}
