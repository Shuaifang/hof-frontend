// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { fetchIntro } from '@/utils/api/global';
import { Button } from 'antd';
import Icons from './Icons';

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
    original_price?: number;
    price?: number;
}

interface Config {
    firstSection: Section;
    otherSections: Section[];
    left: {
        image: string,
        link: string
    }
    right: {
        image: string,
        link: string
    }
}

const AdBanner = ({ imageUrl, link, position }) => {
    const bannerStyle = {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '240px',
        height: '300px',
        top: '50%',
        marginTop: '-150px'
    };
    bannerStyle[position] = '0'

    const renderImage = () => (
        <div
            className="cursor-pointer z-[999] bg-center bg-no-repeat fixed "
            style={bannerStyle}
            onClick={() => link && window.open(link, '_blank')}
        >

            {position === 'left' ? <div className='w-[240px] text-center absolute bottom-[-50px]' >
                <Button
                    type="primary"
                    icon={<Icons.MessageCircle className="h-4 w-4" style={{
                        transform: 'translateY(3px)'
                    }} />}
                    style={{
                        background: '#000',
                    }}
                    onClick={() => {
                        window.open("https://docs.google.com/forms/d/1EoN8lT3cEXrvbdZ_eu2CPRwlk-0nGryfs23xOaVEJvY")
                    }}
                >Submit Request</Button>
            </div> : ''}
        </div>
    );

    return (
        <>
            {renderImage(position)}
        </>
    );
};


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
                            specialNote: good.remark,
                            original_price: good.original_price,
                            price: good.price
                        })),
                        left: response.data.left,
                        right: response.data.right,
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

    return <>
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
                            <span className="text-sm font-normal line-through">${section.original_price}</span> ${section.price}
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

        {/* 在页面左侧和右侧固定的对联广告，如果有image的话，如果同时有link点击会打开新页面 */}
        {/* left */}
        {
            data.left.image && <AdBanner imageUrl={data.left.image} link={data.left.link} position='left' />
        }
        {/* right */}
        {
            data.right.image && <AdBanner imageUrl={data.right.image} link={data.right.link} position='right' />
            // </div>
        }
    </>;
}


export default ADRow;
