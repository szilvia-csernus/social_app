import { Spinner } from "react-bootstrap";
import styles from "./Asset.module.css";

type AssetProps = {
    spinner?: boolean;
    src?: string;
    message?: string
}

const Asset = ({ spinner=false, src, message}: AssetProps) => {
  return (
    <div className={`${styles.Asset} p-4`}>
        {spinner && <Spinner animation="border" />}
        {src && <img src={src} alt={message} width={80} height={80}/>}
        {message && <p className="mt-4">{message}</p>}
    </div>
  )
}

export default Asset