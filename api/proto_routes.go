package api

import (
	"net/http"

	"github.com/gorilla/mux"
)

// All routes related to protocols
func (api *APIServer) protoRoutes(r *mux.Router) {
	// check if auth token needed
	api.IfTokenNeeded(r)

	// get all protocols
	r.HandleFunc("/get/all", api.getAllProtocols).Methods(http.MethodOptions, http.MethodGet)

	// get information about the last summary of
	// top protocol base on an intervals like 1m, 2h ...
	r.HandleFunc("/get/top/{top}/device/{deviceID}/interval/{interval}", api.getTopProtosByDeviceByInterval).Methods(http.MethodOptions, http.MethodGet)

}
