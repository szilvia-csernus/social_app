import React, { forwardRef } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import styles from './MoreDropdown.module.css';
import { useNavigate } from 'react-router-dom';

type MoreDropdownProps = {
	handleEdit: () => void;
	handleDelete: () => void;
}

const ThreeDots = forwardRef<
	HTMLElement,
	{ onClick: (e: React.MouseEvent<HTMLElement>) => void }
>(({ onClick }, ref) => (
	<i
		className="fas fa-ellipsis-v"
		ref={ref}
		onClick={(e: React.MouseEvent<HTMLElement>) => {
			e.preventDefault();
			onClick(e);
		}}
	/>
));

export const MoreDropdown = ({ handleEdit, handleDelete }: MoreDropdownProps) => {
	return (
		<Dropdown drop="start" className="ml-auto">
			<Dropdown.Toggle as={ThreeDots} />

			<Dropdown.Menu
				className="text-center"
			>
				<Dropdown.Item
					className={styles.DropdownItem}
					onClick={handleEdit}
					aria-label="edit"
				>
					<i className="fas fa-edit" />
				</Dropdown.Item>
				<Dropdown.Item
					className={styles.DropdownItem}
					onClick={handleDelete}
					aria-label="delete"
				>
					<i className="fas fa-trash-alt" />
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
};

type ProfileEditDropdownPropsType =
	{ id: number}


export function ProfileEditDropdown({ id }:ProfileEditDropdownPropsType) {
	const navigate = useNavigate();
	return (
		<Dropdown className={`ml-auto px-3 ${styles.Absolute}`} drop="start">
			<Dropdown.Toggle as={ThreeDots} />
			<Dropdown.Menu>
				<Dropdown.Item
					onClick={() => navigate(`/profiles/${id}/edit`)}
					aria-label="edit-profile"
				>
					<i className="fas fa-edit" /> edit profile
				</Dropdown.Item>
				<Dropdown.Item
					onClick={() => navigate(`/profiles/${id}/edit/username`)}
					aria-label="edit-username"
				>
					<i className="far fa-id-card" />
					change username
				</Dropdown.Item>
				<Dropdown.Item
					onClick={() => navigate(`/profiles/${id}/edit/password`)}
					aria-label="edit-password"
				>
					<i className="fas fa-key" />
					change password
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
}
