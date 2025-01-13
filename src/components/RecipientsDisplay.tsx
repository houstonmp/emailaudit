import { useEffect, useState, useRef } from 'react';
import RecipientsBadge from "./RecipientsBadge"
import styled from 'styled-components'

export interface RecipientProps {
    recipients: string[],
}

function getTextSize(recipientText: string): number | null { // Check email width since dont isn't monospace
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
    const [tooltipText, setTooltipText] = useState('');
    const tooltipArray: string[] = [];
    const recipientsArray: string[] = [];
    // Badge ? useState(Badge.)
    useEffect(() => { //Initialize badge width and parent tdWidth
        if (textRef.current && badgeRef.current) {
            const tdElement = textRef.current.parentNode as HTMLElement | null;
            const badgeElement = badgeRef.current as HTMLElement | null;

            if (tdElement && badgeElement) {
                const tdElementStyle = window.getComputedStyle(tdElement)
                // const badgeElementStyle = window.getComputedStyle(badgeElement)
                setTdWidth(tdElement.clientWidth - parseFloat(tdElementStyle.paddingLeft) - parseFloat(tdElementStyle.paddingRight)); //Include padding in calculations
                setBadgeWidth(badgeElement.clientWidth)
                console.log("padding", parseFloat(tdElementStyle.paddingLeft), badgeWidth)
            }
        }
    }, [])
    useEffect(() => {
        recipients.forEach((el: string, index: number) => {
            if (index === 0) { //Add first email by default
                recipientsArray.push(el)
            }
            else if (tooltipArray.length === 0) {//Check that tooltipArray is empty
                const currentNumSize = getTextSize((recipientsArray.join(', ') + el + ', ...'))
                if (currentNumSize && ((currentNumSize / (tdWidth - badgeWidth)) < 1)) { //Check for currentNumSize and divide by total td width
                    console.log("CurrentElement", el, currentNumSize, tdWidth, badgeWidth)
                    recipientsArray.push(el)
                }
                else { //Push to tooltipArray if too long
                    tooltipArray.push(el)
                }
            }
            else { //Push to tooltipArray after first email fails width check
                tooltipArray.push(el)
            }
        })
        setTdText(recipientsArray.join(', ') + ', ...')
        setTooltipText(tooltipArray.join(', '))
    }, [tdWidth, badgeWidth])

    return (<div ref={textRef}>
        <span >
            {tdText}
        </span>
        <span ref={badgeRef} style={{ float: "right" }}>{recipients.length > 1 && <RecipientsBadge title={tooltipText} numTruncated={recipients.length - 1}></RecipientsBadge>}
        </span >
    </div >)
}

// export default styled(RecipientsDisplay)`
// //   display: flex;
// //   align-items: center;
// //   width: 100%;

// //   > span:first-child {
// //     display: block;
// //     flex: 1;
// //     overflow: hidden;
// //     text-overflow: ellipsis;
// //     white-space: nowrap;
// //   }

// //   > span:last-child {
// //     display: block;
// //     flex-shrink: 1;
// //     flex-grow: 0;
// //     flex-basis: auto;
// //   }
// `