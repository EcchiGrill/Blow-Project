import styles from 'styles/Profile.module.css'

const Profile = () => {
    return (
        <main className={styles.content}>
        <div>
          <img src="https://placehold.co/800x400" alt="" />
        </div>
        <div>
          ava + description
        </div>
        <div>
          My posts
          <div>
            New post
          </div>
          <div>
            post 1
          </div>
          <div>
            post 2
          </div>
        </div>
      </main>
    );
} 

export default Profile;