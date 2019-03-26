import * as React from "react";
import { View, Text, FlatList } from 'react-native';
import { IReceipt, IReceiptItem } from '../interface/receipt';

interface IProps {
    receipt: IReceipt;
}

export default class Receipt extends React.Component<IProps> {
    render() {
        const { receipt } = this.props;
        return (
            <View>
                {!receipt ? (<Text>No Receipt</Text>) : (
                    <View>
                        <Text style={{fontSize:20,fontWeight:'bold'}}>{receipt.location}</Text>
                        <FlatList data={receipt.items} keyExtractor={(item, index) => index.toString()} renderItem={({item}: {item: IReceiptItem}) => (
                            <>
                                <Text style={{alignSelf:'flex-start'}}>{item.text}</Text>
                                <Text style={{alignSelf:'flex-end'}}>{item.total}</Text>
                            </>
                        )}/>
                        <Text style={{fontWeight:'bold',alignSelf:'flex-end'}}>TOTAL: {receipt.total}</Text>
                    </View>
                )}

            </View>
        )
    }
}