import styles from './Chats.module.css'

const Chats = () => {
    return (
        <main className={styles.chats}>
        <div className={styles.chatsList}>
         <h2>Chats</h2>
         <h3>Bobis</h3>
         <h3>Roflik</h3>
         <h3>John Doe</h3>
        </div>
        <div className={styles.chatWindow}>
            <img className= {styles.avatar} src="https://i.pinimg.com/736x/0e/d3/8a/0ed38a5eafa6341394009c211f827e37.jpg" alt="" /> 
            Matr1x
            <div>fdsfsd</div>
            <div>ffgfdgdf</div>
            <div>dssdf</div>
        </div>
      </main>
    );
} 

export default Chats;