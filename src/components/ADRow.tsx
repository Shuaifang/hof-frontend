import React, { useEffect, useState } from 'react';
import { fetchIntro } from '@/utils/api/global';

interface Image {
    src: string;
    alt: string;
}

interface Section {
    title: string;
    listItems: string[];
    image?: Image;
    footerText?: string;
    specialNote?: string;
}

interface Config {
    firstSection: Section;
    otherSections: Section[];
}

const ADRow: React.FC<{ menuId?: number }> = ({ menuId }) => {
    const [data, setData] = useState<Config | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchIntro({ menuId });
                if (response.code === 0) {
                    // Transform the data into the expected format
                    const transformedData: Config = {
                        firstSection: {
                            title: response.data.tutor.title,
                            listItems: response.data.tutor.introList.map((item: { name: any; }) => item.name),
                            image: {
                                src: response.data.tutor.qrcode,
                                alt: 'QR Code'
                            },
                            footerText: '可扫码咨询客服'
                        },
                        otherSections: response.data.goods.map((good: { title: any; sku_title: any; list: any[]; intro_text: any; remark: any; }) => ({
                            title: `${good.title} ${good.sku_title}`,
                            listItems: good.list.map(item => item.name),
                            footerText: good.intro_text,
                            specialNote: good.remark
                        }))
                    };
                    setData(transformedData);
                } else {
                    console.error('Failed to fetch data: ', response.message);
                }
            } catch (error) {
                console.error('An error occurred while fetching data: ', error);
            }
        };
        fetchData();
    }, [menuId]);

    if (!data) {
        return <div></div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#f5f5f7] p-[10px]">
            <div className="w-full">
                <h2 className="text-lg font-bold">{data.firstSection.title}</h2>
                <ul className="list-disc pl-5">
                    {data.firstSection.listItems.map((item, index) => (
                        <li key={index}><h6>{item}</h6></li>
                    ))}
                </ul>
                {data.firstSection.image &&
                    <img src={data.firstSection.image.src} alt={data.firstSection.image.alt} className="w-72 h-72" />
                }
                {data.firstSection.footerText &&
                    <h2 className="text-lg font-bold text-center mt-[3px]">{data.firstSection.footerText}</h2>
                }
            </div>
            {data.otherSections.map((section, index) => (
                <div key={index} className="w-full">
                    <div className="p-4 bg-[#444444] text-white">
                        <h3 className="text-lg font-bold">{section.title}</h3>
                        <span className="text-sm">{section.footerText}</span>
                    </div>
                    <div className="p-4">
                        <p className="text-3xl font-bold text-center text-[#444444]" style={{
                            fontWeight: '700'
                        }}>
                            <span className="text-sm font-normal line-through">$568</span> $298
                        </p>
                        <div className="list-disc pl-5">
                            {section.listItems.map((item, itemIndex) => (
                                <div className='h-[50px] flex ' style={{
                                    borderTop: itemIndex ? '1px dotted #ddd' : '',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }} key={itemIndex}> {item}</div>
                            ))}
                        </div>
                        {section.specialNote && <div style={{
                            color: '#E62929',
                            textAlign: 'center',
                            width: '100%',
                            marginTop: '30px',
                            fontSize: '13px'
                        }}>{section.specialNote}</div>}
                    </div>
                </div>
            ))}
        </div>
    );
}


export default ADRow;
