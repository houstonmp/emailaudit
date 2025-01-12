import { useEffect, useState, useRef } from 'react';
import RecipientsBadge from "./RecipientsBadge"

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
                setTdWidth(tdElement.clientWidth - parseInt(window.getComputedStyle(tdElement).paddingLeft) - parseInt(window.getComputedStyle(tdElement).paddingRight));
                setBadgeWidth(badgeElement.offsetWidth)
                console.log("padding", parseInt(tdElement.style.paddingLeft))
            }
        }

        console.log("Beginning Check...")
        const text = recipients.reduce((accumulator: string, currentValue: string, currentIndex: number) => {
            const accNum = getTextSize(accumulator);
            const currentNum = getTextSize(currentValue + '...');

            if (currentIndex === 0) {
                return currentValue;
            } else if (accNum && currentNum) {
                const textWidth = ((accNum + currentNum) / (tdWidth - badgeWidth))
                const condition = textWidth < 1
                console.log("Condition", accumulator + currentValue, ((accNum + currentNum) / (tdWidth - badgeWidth)), condition)
                return condition ? (accumulator + ", " + currentValue) : accumulator;
            }
            // console.log(accNum, currentNum, "No accNum or currentNum")
            return accumulator;
        }, '');

        setTdText(text)

    }, [tdWidth])

    return (<span ref={textRef}>
        <span>
            {tdText}
        </span>
        <span style={{ float: 'right' }} ref={badgeRef}>{recipients.length > 1 && <RecipientsBadge numTruncated={recipients.length - 1}></RecipientsBadge>}
        </span>
    </span>)
}
