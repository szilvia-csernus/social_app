/* Loader styling from https://loading.io/css/ */

import classes from './Spinner.module.css';

const Spinner = () => {
	return (
		<div className={classes.content}>
			<div className={classes.spinner}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};

export default Spinner;
