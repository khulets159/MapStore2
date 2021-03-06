/**
* Copyright 2018, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/
const React = require("react");
const PagedCombo = require('../../../../misc/combobox/PagedCombobox');
const {Row, Col} = require('react-bootstrap');
const fixedOptions = require("../../enhancers/fixedOptions");
const localizedProps = require("../../../../misc/enhancers/localizedProps");
const { compose, defaultProps, withHandlers, withPropsOnChange} = require('recompose');
const Message = require('../../../../I18N/Message');
const {connect} = require("react-redux");
const {createSelector} = require("reselect");
const {servicesConfigSel} = require("../../../../../selectors/rulesmanager");
const selector = createSelector(servicesConfigSel, services => ({
    services
}));

const RequestSelector = (props) => (
    <Row className={props.disabled ? 'ms-disabled' : ''}>
        <Col xs={12} sm={6}>
            <Message msgId="rulesmanager.request"/>
        </Col>
        <Col xs={12} sm={6}>
            <PagedCombo {...props}/>
        </Col>
    </Row>);

module.exports = compose(
    connect(selector),
    defaultProps({
        size: 5,
        emitOnReset: true,
        textField: "label",
        valueField: "value",
        parentsFilter: {},
        filter: "startsWith",
        placeholder: "rulesmanager.placeholders.request",
        services: {
            "WFS": [
                "DescribeFeatureType",
                "GetCapabilities",
                "GetFeature",
                "GetFeatureWithLock",
                "LockFeature",
                "Transaction"
            ],
            "WMS": [
                "DescribeLayer",
                "GetCapabilities",
                "GetFeatureInfo",
                "GetLegendGraphic",
                "GetMap",
                "GetStyles"
            ]
        }
    }),
    withPropsOnChange(["service", "services"], ({services = {}, service}) => {
        return {
        data: service && (services[service] || []).map(req => ({label: req, value: req.toUpperCase()})),
        parentsFilter: {service},
        disabled: !service
    }; }),
    withHandlers({
        onValueSelected: ({setOption = () => {}}) => filterTerm => {
            setOption({key: "request", value: filterTerm});
        }
    }),
    localizedProps(["placeholder"]),
    fixedOptions
)(RequestSelector);
