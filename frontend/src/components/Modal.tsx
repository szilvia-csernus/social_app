import ReactDOM from 'react-dom';

import classes from './Modal.module.css';
import { FC, PropsWithChildren } from 'react';

const Overlay: FC<PropsWithChildren> = (props) => {
	const clickHandler = () => {
		// close popup messages
	};

	return (
		<div className={classes.backdrop} onClick={clickHandler}>
			<div className={classes.overlay}>
				<div className={classes.canvas}>{props.children}</div>
			</div>
		</div>
	);
};


const Modal: FC<PropsWithChildren> = (props) => {
	const portalElement = document.getElementById('overlay');
	return (
		<>
			{ReactDOM.createPortal(
				<Overlay>{props.children}</Overlay>, portalElement!
			)}
		</>
	);
};

export default Modal;
