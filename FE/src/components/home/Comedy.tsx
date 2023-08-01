import React, { useState } from 'react';
import style from '@/res/css/module/Home.module.css';

const Comedy = () => {
    let [comedy, setComedy] = useState<string>(`sample\nsample`);
    return (
        <div>
            <div className={style.subtitle_comedy}>코딩문학제 오늘의 작품</div>
                <div className={style.box}>
                    <div className={style.content}>
                        {comedy}
                    </div>
                </div>
            </div>
        
    );
};

export default Comedy;