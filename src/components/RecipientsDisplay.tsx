import { useEffect, useState, useRef } from 'react';
import RecipientsBadge from "./RecipientsBadge"
import styled from 'styled-components'

export interface RecipientProps {
    recipients: string[],
    tableId: string
}

function getTextSize(recipientText: string): number | null {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context !== null) {
        context.font = '16px Arial'; // Set the font style
        const textWidth = context.measureText(recipientText).width;
        return textWidth;
    }
    else return null;
}


export default function RecipientsDisplay({ recipients }: RecipientProps) {

    const textRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const [tdWidth, setTdWidth] = useState(0);
    const [badgeWidth, setBadgeWidth] = useState(0);
    const [tdText, setTdText] = useState('');
    // Badge ? useState(Badge.)
    useEffect(() => {
        if (textRef.current && badgeRef.current) {
            const tdElement = textRef.current.parentNode as HTMLElement | null;
            const badgeElement = badgeRef.current as HTMLElement | null;
            if (tdElement && badgeElement) {
                setTdWidth(tdElement.offsetWidth);
                setBadgeWidth(badgeElement.offsetWidth)
                console.log("Badge", badgeElement.offsetWidth)
            }
        }

        const text = recipients.reduce((accumulator: string, currentValue: string, currentIndex: number) => {
            const accNum = getTextSize(accumulator);
            const currentNum = getTextSize(currentValue);

            if (currentIndex === 0) {
                return currentValue;
            } else if (accNum && currentNum) {
                const condition = ((accNum + currentNum) / (tdWidth - (accNum / (tdWidth - badgeWidth))) < 1);
                console.log("Condition", (accNum + currentNum) / (tdWidth - (accNum / (tdWidth - badgeWidth))), condition)
                return condition ? accumulator + ", " + currentValue : accumulator;
            }

            return accumulator;
        }, '');

        setTdText(text)

        //         {recipients.map((el: string, i: number) => {
        //     if (i + 1 === recipients.length) {
        //         const textNum = getTextSize(el);
        //         // if (textNum) console.log(el, (tdWidth && (textNum / (tdWidth - badgeWidth))))
        //         return el
        //     }
        //     else {
        //         const textNum = getTextSize(el);
        //         if (textNum && (tdWidth && (0 < (textNum / (tdWidth - badgeWidth))))) {
        //             return el + ', '
        //         }
        //     }
        // })}

    }, [tdWidth])

    return (<span ref={textRef}>
        <span>
            {tdText}
        </span>
        <span ref={badgeRef}>{recipients.length > 1 && <RecipientsBadge numTruncated={recipients.length - 1}></RecipientsBadge>}
        </span>
    </span>)
}
