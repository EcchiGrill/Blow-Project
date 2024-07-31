import styles from './ProfileInfo.module.css'

const ProfileInfo = () => {
    return (
        <div className={styles.profileInfo}>
        <div>
          <img src="https://placehold.co/1200x400" alt="" />
        </div>
        <div className={styles.description}>
          ava + description
        </div>
      </div>
    );
} 

export default ProfileInfo;