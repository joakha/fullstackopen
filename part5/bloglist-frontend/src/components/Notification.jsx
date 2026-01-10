import { useEffect } from 'react'
import '../../index.css'

const Notification = ({ notification, setNotification }) => {
    useEffect(() => {
        const timeOut = setTimeout(() => {
            setNotification(null);
        }, 5000)

        return () => clearTimeout(timeOut)
    }, [setNotification])

    return (
        <div className={notification.type === "success" ? "success" : "failure"}>{notification.message}</div>
    )
}

export default Notification