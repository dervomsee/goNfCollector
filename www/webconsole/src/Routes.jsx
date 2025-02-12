import React from 'react'

import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import DashboardComponent from './components/Dashbaord/Dashboard'
import GeoLocationsComponent from './components/GeoLocations/GeoLocations'
import HostsComponent from './components/Hosts/Hosts'
import MDEditComponent from './components/managedDevices/MDEdit'
import ManagedDeviceComponent from './components/managedDevices/ManagedDevice'
import MDReport from './components/managedDevices/MDReport'
import PortsComponent from './components/Ports/Ports'
import ProtocolsComponent from './components/Protocols/Protocols'
import ThreatsComponent from './components/Threats/Threats'

import MainAdminLayout from './layout/MainAdmin'
import HostReport from './components/Hosts/HostReport'

const MainRouter = () => {
    return (
        <Router>
            <MainAdminLayout>
                <Switch>
                    <Route exact path="/" component={DashboardComponent} name="dashboard" />
                    <Route exact path="/dashboard" component={DashboardComponent} name="dashboard" />

                    <Route exact path="/devices" component={ManagedDeviceComponent} name="devices" />
                    <Route exact path="/devices/:device/report" component={MDReport} name="devices_report" />
                    <Route exact path="/devices/:device/edit" component={MDEditComponent} name="devices_report" />

                    <Route exact path="/hosts" component={HostsComponent} name="hosts" />
                    <Route exact path="/hosts/:host/report" component={HostReport} name="host_report" />

                    <Route exact path="/ports" component={PortsComponent} name="ports" />
                    <Route exact path="/protocols" component={ProtocolsComponent} name="protocols" />
                    <Route exact path="/geos" component={GeoLocationsComponent} name="geos" />

                    <Route exact path="/threats" component={ThreatsComponent} name="threats" />
                    <Route exact path="/threats/:host/report" component={HostReport} name="threat_host_report" />
                </Switch>
            </MainAdminLayout>
        </Router>
    )
}


export default MainRouter