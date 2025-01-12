export interface RecipientProps {
    recipients: string[]
}

export default function RecipientsDisplay({ recipients }: RecipientProps) {
    return (<span>{recipients.map((el: string, i: number) => {
        if (i + 1 === recipients.length) {
            return el
        }
        else {
            console.log("email: " + el, "index: " + i)
            return el + ', '
        }
    })}</span>)
}
