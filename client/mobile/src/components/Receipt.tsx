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
                        <Text>{receipt.location}</Text>
                        <FlatList data={receipt.items} renderItem={({item}: {item: IReceiptItem}) => (
                            <>
                            <Text>{item.name}</Text>
                                <Text>{item.total}</Text>
                            </>
                        )}/>
                        <Text>TOTAL: {receipt.total}</Text>
                    </View>
                )}

            </View>
        )
    }
}