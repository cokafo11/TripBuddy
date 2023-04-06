import axios from 'axios'
import React, {useState, useEffect} from 'react'
import { Modal, Button } from 'react-bootstrap'
import styles from '../styles/ContentProviderProfile.module.css'
import { getFormattedDate } from '../utils/utilFunctions'
import { IKImage } from 'imagekitio-react'


const ContentProviderProfile = ({id, setPostedBy}) => {
    const [profile, setProfile] = useState({})
    const [subscribed, setSubscribed] = useState(false)
    const url = process.env.REACT_APP_SERVER_URL

    const getProfile = async () => {
        const response = await axios.get(`${url}/profile/getContentProvider/${id}`)
        setProfile(response.data)
    }

    const subscribe = async () => {
    }

    const unsubscribe = async () => {
    }

    useEffect(() => {
        getProfile()
    }, [])

  return (
    <div className={styles.wrapper}>
        <div className={styles.popup}>
            
            <Modal.Header className={styles.header}>
                <Modal.Title>Profile</Modal.Title>
                {!subscribed ? <Button variant="success" onClick={() => subscribe()}>Subscribe</Button> : <Button variant="light" onClick={() => unsubscribe()}>Unsubscribe</Button>}
            </Modal.Header>

            <div>
                {profile?.picture ? <IKImage className={styles.image} path={`profiles/${profile?.picture}`} /> : <img className={styles.image} src="/no-image.jpg"/>}
                <span className={styles.created}>On TripBuddy from {getFormattedDate(profile?.createdAt)}</span>
            </div>

            <div>
                <span className={styles.username}>@{profile?.username}</span>
                <span className={styles.name}>{profile?.firstName} {profile?.lastName}</span>
                <div>
                    {profile?.city && <span className={styles.city}>{profile?.city}</span>}
                    {profile?.country && <span className={styles.country}>{profile?.country}</span>}
                </div>
                
                <span className={styles.bio}>{profile?.bio}</span>
            </div>

        <Modal.Footer  className={styles.footer}>
          <Button variant="secondary" onClick={() => setPostedBy(null)}>Close</Button>
        </Modal.Footer>

      </div>
    </div>
  )
}

export default ContentProviderProfile