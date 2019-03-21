import * as React from "react";
import { Control, Field, Input, Navbar, NavbarBrand, NavbarEnd, NavbarItem, NavbarMenu, NavbarStart } from "bloomer";
import Logo from "./Logo";
import FAIcon from "./Icon";

interface IProps {}
interface IState {
    selected: string;
}

const navItem = (title: string, slug: string, ref: Nav) => (
    <NavbarItem
        onClick={() => ref.setState({selected: slug})}
        className={`nav-${slug}`}
        isActive={ref.state.selected === slug}
        style={{alignItems:'bottom'}}
        href={'#'}
    >
        {title}
     </NavbarItem>
);

export default class Nav extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            selected: 'home',
        }
    }

    render() {
        return (
            <>
            <Navbar style={{alignItems:'bottom'}}>
                <NavbarBrand>
                    <NavbarItem>
                        <Logo/>
                    </NavbarItem>
                </NavbarBrand>
                <NavbarMenu>
                    <NavbarStart>
                        {navItem('Home','home', this)}
                        {navItem('Finance','first', this)}
                        {navItem('Chores','second', this)}
                        {navItem('Shopping','third', this)}
                        {navItem('Projects','fourth', this)}
                    </NavbarStart>
                    <NavbarEnd>
                        <NavbarItem style={{alignItems:'bottom'}}>
                            <Field>
                                <Control hasIcons>
                                    <Input isSize={'small'} placeholder='search' />
                                    <FAIcon transform={{size: 9}} className="icon is-left is-size-7" icon={'search'}/>
                                </Control>
                            </Field>
                        </NavbarItem>
                    </NavbarEnd>
                </NavbarMenu>
            </Navbar>
            <div style={{height:'.3rem'}}  className={'is-active nav-'+this.state.selected}/>
            </>
        );
    }
}