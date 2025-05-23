import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button as MButton, Alert } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Draggable, { DraggableCore } from 'react-draggable';

import Nui from '../../util/Nui';

import {
    AdvancedButton,
    Button,
    Checkbox,
    ColorList,
    ColorPicker,
    Slider,
    SubMenu,
    SubMenuBack,
    Ticker,
    Input,
    Number,
    Select,
    Text,
} from '../MenuItems';

import Logo from '../../assets/logo.png';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        background: theme.palette.secondary.dark,
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        maxHeight: 800,
        width: 500,
        position: 'absolute',
        margin: 'auto',
        textAlign: 'center',
        fontSize: 30,
        color: theme.palette.text.main,
        zIndex: 1000,
        padding: 20,
        overflow: 'hidden',
    },
    menuHeader: {
        color: theme.palette.text.main,
        position: 'relative',
        padding: '14px 14px 14px 0px',
        width: '100%',
        marginBottom: 20,
        fontSize: 16,
        letterSpacing: 1,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        maxWidth: '95%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        userSelect: 'none',
        textAlign: 'left',
        '&:hover': {
            cursor: 'move',
        },
    },
    menuButton: {
        marginBottom: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 25,
        right: 15,
        color: theme.palette.primary.main,
        padding: 5,
        background: `transparent`,
        minWidth: 32,
        boxShadow: 'none',
        '&:hover': {
            color: theme.palette.primary.main,
            background: `transparent`,
            boxShadow: 'none',
            '& svg': {
                filter: 'brightness(0.6)',
                transition: 'filter ease-in 0.15s',
            },
        },
    },
    buttons: {
        overflowY: 'auto',
        overflowX: 'hidden',
        maxHeight: 695,
        display: 'block',
    },
    branding: {
        position: 'absolute',
        opacity: 0.05,
        top: -100,
        right: 0,
        left: 0,
        margin: 'auto',
        width: '100%',
        maxWidth: 300,
        zIndex: -1,
        userSelect: 'none',
    },
}));

export default (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const menu = useSelector((state) => state.menu.menu);
    const hidden = useSelector((state) => state.app.hidden);

    const [pos, setPos] = useState({ x: 25, y: 25 });

    useEffect(() => {
        setPos({ x: 25, y: 25 });
    }, [hidden]);

    const onChange = (e, p) => {
        e.preventDefault();
        e.stopPropagation();
        setPos({ x: p.x, y: p.y });
    };

    const [elements, setElements] = useState([]);
    useEffect(() => {
        setElements(
            menu.items.map((item, i) => {
                switch (item.type.toUpperCase()) {
                    case 'ADVANCED':
                        return (
                            <AdvancedButton
                                key={`${menu.id}-${i}`}
                                mId={menu.id}
                                id={i}
                                data={item}
                            />
                        );
                    case 'CHECKBOX':
                        return (
                            <Checkbox
                                key={`${menu.id}-${i}`}
                                mId={menu.id}
                                id={i}
                                data={item}
                            />
                        );
                    case 'SLIDER':
                        return (
                            <Slider
                                key={`${menu.id}-${i}`}
                                mId={menu.id}
                                id={i}
                                data={item}
                            />
                        );
                    case 'TICKER':
                        return (
                            <Ticker
                                key={`${menu.id}-${i}`}
                                mId={menu.id}
                                id={i}
                                data={item}
                            />
                        );
                    case 'COLORPICKER':
                        return (
                            <ColorPicker
                                key={`${menu.id}-${i}`}
                                mId={menu.id}
                                id={i}
                                data={item}
                            />
                        );
                    case 'COLORLIST':
                        return (
                            <ColorList
                                key={`${menu.id}-${i}`}
                                mId={menu.id}
                                id={i}
                                data={item}
                            />
                        );
                    case 'INPUT':
                        return (
                            <Input
                                key={`${menu.id}-${i}`}
                                mId={menu.id}
                                id={i}
                                data={item}
                            />
                        );
                    case 'NUMBER':
                        return (
                            <Number
                                key={`${menu.id}-${i}`}
                                mId={menu.id}
                                id={i}
                                data={item}
                            />
                        );
                    case 'SELECT':
                        return (
                            <Select
                                key={`${menu.id}-${i}`}
                                mId={menu.id}
                                id={i}
                                data={item}
                            />
                        );
                    case 'TEXT':
                        return (
                            <Text
                                key={`${menu.id}-${i}`}
                                mId={menu.id}
                                id={i}
                                data={item}
                            />
                        );
                    case 'SUBMENU':
                        return (
                            <SubMenu
                                key={`${menu.id}-${i}`}
                                id={i}
                                mId={menu.id}
                                data={item}
                            />
                        );
                    case 'GOBACK':
                        return (
                            <SubMenuBack
                                key={`${menu.id}-${i}`}
                                id={i}
                                mId={menu.id}
                                data={item}
                            />
                        );
                    default:
                        return (
                            <Button
                                key={`${menu.id}-${i}`}
                                id={i}
                                mId={menu.id}
                                data={item}
                            />
                        );
                }
            }),
        );
    }, [menu]);

    const onClick = () => {
        Nui.send('Close');
        dispatch({
            type: 'CLEAR_MENU',
        });
    };

    return (
        <Draggable
            handle=".drag-handle"
            bounds="#app"
            defaultPosition={{ x: 25, y: 25 }}
            position={pos}
            onDrag={onChange}
        >
            <div className={classes.wrapper} hidden={hidden}>
                <MButton
                    className={classes.closeButton}
                    variant="contained"
                    color="primary"
                    onClick={onClick}
                >
                    <FontAwesomeIcon icon="x" />
                </MButton>
                <img className={classes.branding} src={Logo} />
                <div className={`${classes.menuHeader} drag-handle`}>
                    {Boolean(menu.label) ? menu.label : 'mythicRP'}
                </div>
                <div className={classes.buttons}>
                    {elements.length > 0 ? (
                        elements
                    ) : (
                        <Alert variant="filled" color="error">
                            Menu Has No Content
                        </Alert>
                    )}
                </div>
            </div>
        </Draggable>
    );
};
