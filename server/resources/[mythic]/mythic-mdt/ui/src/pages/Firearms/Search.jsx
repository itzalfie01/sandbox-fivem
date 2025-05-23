import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	TextField,
	InputAdornment,
	IconButton,
	Pagination,
	List,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { throttle } from 'lodash';
import qs from 'qs';

import Nui from '../../util/Nui';
import { Loader } from '../../components';
import Item from './components/Firearm';
import { useNavigate, useLocation } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles((theme) => ({
	wrapper: {
		display: 'flex',
		flexDirection: 'column',
		padding: '10px 5px 10px 5px',
		height: '100%',
	},
	search: {},
	results: {
		flexGrow: 1,
	},
	items: {
		maxHeight: '95%',
		height: '95%',
		overflowY: 'auto',
		overflowX: 'hidden',
	},
	form: {},
	formControl: {},
	noResults: {
		margin: '15% 0',
		textAlign: 'center',
		fontSize: 22,
		color: theme.palette.text.main,
	},
}));

export default (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const history = useNavigate();
	const location = useLocation();
	const type = 'firearm';
	const PER_PAGE = 6;
	const searchTerm = useSelector((state) => state.search.searchTerms[type]);
	let qry = qs.parse(location.search.slice(1));

	const [searched, setSearched] = useState(null);
	const [pages, setPages] = useState(1);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState(false);
	const [results, setResults] = useState(Array());

	useEffect(() => {
		if (qry.search) {
			dispatch({
				type: 'UPDATE_SEARCH_TERM',
				payload: {
					type: type,
					term: qry.search,
				},
			});
			setSearched(qry.search);
			fetch(qry.search);
		} else if (searchTerm != '') fetch(searchTerm);
	}, []);

	useEffect(() => {
		setPages(Math.ceil(results.length / PER_PAGE));
	}, [results]);

	const fetch = useMemo(
		() =>
			throttle(async (value) => {
				let s = qs.parse(location.search.slice(1));
				s.search = value;
				history({
					path: location.pathname,
					search: qs.stringify(s),
				});
				setLoading(true);

				try {
					let res = await (
						await Nui.send('Search', {
							type: type,
							term: value,
						})
					).json();
					if (res) setResults(res);
					else setErr(true);
					setLoading(false);
				} catch (err) {
					console.log(err);
					if (process.env.NODE_ENV != 'production') {
						setResults([
							{
								model: "SG-26",
								serial: "GGG",
								owner_sid: 1,
								owner_name: 'Bob',
								purchased: 1687699918 * 1000,
							}
						])
					} else {
						setErr(true);
					}
					setLoading(false);
				}
			}, 1000),
		[],
	);

	const onSubmit = (e) => {
		e.preventDefault();
		if (searched == searchTerm) return;
		setSearched(searchTerm);
		if (searchTerm == '') {
			let s = qs.parse(location.search.slice(1));
			delete s.search;
			history({
				path: location.pathname,
				search: qs.stringify(s),
			});
			dispatch({
				type: 'CLEAR_SEARCH',
				payload: { type },
			});
		} else {
			fetch(searchTerm);
		}
	};

	const onSearchChange = (e) => {
		dispatch({
			type: 'UPDATE_SEARCH_TERM',
			payload: {
				type: type,
				term: e.target.value,
			},
		});
	};

	const onClear = () => {
		let s = qs.parse(location.search.slice(1));
		delete s.search;
		history({
			path: location.pathname,
			search: qs.stringify(s),
		});
		dispatch({
			type: 'CLEAR_SEARCH',
			payload: { type },
		});
	};

	const onPagi = (e, p) => {
		setPage(p);
	};

	return (
		<div className={classes.wrapper}>
			<div className={classes.search}>
				<form autoComplete="off" onSubmit={onSubmit}>
					<TextField
						fullWidth
						variant="standard"
						name="search"
						value={searchTerm}
						onChange={onSearchChange}
						error={err}
						helperText={err ? 'Error Performing Search' : null}
						label="Search By Exact Serial Number, Owner State ID or Owner Name"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									{searchTerm != '' && (
										<IconButton
											type="button"
											size="small"
											onClick={onClear}
										>
											<FontAwesomeIcon
												icon={['fas', 'xmark']}
											/>
										</IconButton>
									)}
									<IconButton
										type="submit"
										size="small"
										disabled={
											searchTerm == '' ||
											searched == searchTerm
										}
									>
										<FontAwesomeIcon
											icon={['fas', 'magnifying-glass']}
										/>
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</form>
			</div>
			<div className={classes.results}>
				{loading ? (
					<Loader text="Loading" />
				) : results?.length > 0 ? (
					<>
						<List className={classes.items}>
							{results
								.slice((page - 1) * PER_PAGE, page * PER_PAGE)
								.map((result) => {
									return (
										<Item
											key={result.serial}
											firearm={result}
										/>
									);
								})}
						</List>
						{pages > 1 && (
							<Pagination
								variant="outlined"
								shape="rounded"
								color="primary"
								page={page}
								count={pages}
								onChange={onPagi}
							/>
						)}
					</>
				) : (
					<p className={classes.noResults}>No Firearms Found</p>
				)}
			</div>
		</div>
	);
};
