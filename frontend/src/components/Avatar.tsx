import styles from './Avatar.module.css';

type AvatarPropsType = {
    src: string;
    height?: number;
    text?: string;
}

function Avatar({ src, height = 45, text }: AvatarPropsType) {
	return (
		<span>
			<img
				src={src}
				className={styles.Avatar}
				height={height}
				width={height}
				alt="avatar"
			/>
            {text}
		</span>
	);
}

export default Avatar;
