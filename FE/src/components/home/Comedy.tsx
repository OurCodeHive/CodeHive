import React, { useState } from 'react';
import style from '@/res/css/module/Home.module.css';
import refresh from '@/res/img/refresh.png';
const Comedy = () => {
    let [comedy, setComedy] = useState<string>(`sample\nsample`);
    return (
        <div>
            <div className={style.subtitle_comedy}>코딩문학제 오늘의 작품 <img src={refresh} alt="코딩문학제 새로고침" /> </div>
                <div className={style.box}>
                    <div className={style.content}>
                        {comedy}
                    </div>
                </div>
            </div>
        
    );
};

export default Comedy;