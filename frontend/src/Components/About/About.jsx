import styles from "./About.module.css";

import linkedicon from "./linkedin.png";


export const About = () => {
  return (
    <section className={styles.About} id="about">
      <div className={styles.container}>
        <h2 className={styles.heading}>About CryptoCare</h2>
        <p className={styles.description}>
          CryptoCare is a blockchain-powered decentralized application (DApp)
          designed to provide secure and efficient financial services enabling
          NGO's to receive donations world wide providing transparency and
          corruption free environment to donors.
        </p>
        <p className={styles.developerInfo}>
          Developed by <strong>Prathamesh Khile and Utkarsha Khotkar</strong>,
          IT engineering students passionate about Web3 and blockchain
          technology.
        </p>
        <div className={styles.links}>
          
          <a
            href="https://www.linkedin.com/in/prathamesh-khile-941024268/"
            className={styles.link}
          >
            <img src={linkedicon} alt="." />
          </a>
          <a
            href="https://www.linkedin.com/in/utkarsha-khotkar/"
            className={styles.link}
          >
            <img src={linkedicon} alt="." />
          </a>
          
        </div>
      </div>
    </section>
  );
};
