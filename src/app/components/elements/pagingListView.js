import BaseElement from "./baseElement";
import {PropTypes} from "react";
import {ListView} from "react-native";

export default class PagingListView extends BaseElement{

	constructor(props){
		super(props);
		this.filter={
			pageIndex:props.initialPageIndex,
			pageSize:props.initialPageSize
		};
		this.state={
			ds:PagingListView.buildDefaultDataSource(props.dataSource)
		};
	}

	static propTypes={
		enabledRefresh:PropTypes.bool,
		onChange:PropTypes.func,
		initialPageIndex:PropTypes.number,
		initialPageSize:PropTypes.number,
		dataSource:PropTypes.array.isRequired,
		children:PropTypes.func.isRequired
	}

	static defaultProps={
		enabledRefresh:true,
		onChange:()=>{},
		initialPageIndex:1,
		initialPageSize:10,
	}

	static buildDefaultDataSource(arr){
		if(arr instanceof Array){
			return new ListView.DataSource({
				rowHasChanged: (preRow, nextRow)=> {
					return preRow !== nextRow;
				}
			}).cloneWithRows(arr);
		}
		throw new Error("method buildDefaultDataSource require the parameter that must be a Array")
	}

	componentWillReceiveProps(nextProps){
		this.$updateState({
			ds:PagingListView.buildDefaultDataSource(nextProps.dataSource)
		});
	}

	render(){
		return (
			<ListView dataSource={this.state.ds}
					  enableEmptySections={true}
					  onEndReached={()=>{
					  	this.filter.pageIndex++;
					  	this.props.onChange({...this.filter});
					  }}
					  onEndReachedThreshold={10}
					  renderRow={this.props.children[0]}></ListView>
		);
	}
}