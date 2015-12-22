# 4ME Core UI Framework

This is a base framework for all 4ME user interfaces. This is built using AngularJS.
The purpose of this code is to wire multiple 4me-ui-plugins into the same single page app while maintaining a clear separation between each plugin.

# Basic UI description
Topbar, sidenav, main window
Dashboard (no plugin selected), plugins widgets

# Core functionnalities
Provides a stable API to wire plugins
Provides basic services to present plugins with core information (CWP id, bound sectors, message queue/websockets hooks)

# How to wire a plugin
Plugin status (sidenav information)
Plugin widget (small component to show in the dashboard)
Plugin name (to show in the sidenav)