<template>
  <div>
    <v-navigation-drawer fixed v-model="drawer" :class="$root.sidebarBg" class="darken-2" dark app>
      <v-toolbar flat dark :class="$root.sidebarBg" class="darken-3">
        <v-list class="pa-0">
          <!-- <router-link to="/dashboard"> -->
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>John Leider</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <!-- </router-link> -->
        </v-list>
      </v-toolbar>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile to="/dashboard">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Dashboard</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- Typography -->
        <v-list-tile to="/typography">
          <v-list-tile-action>
            <v-icon>format_size</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Typography</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- Typography -->

        <!-- Forms controls -->
        <v-list-group prepend-icon="vertical_split" no-action>
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>Form Inputs & Controls</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/text-inputs">
            <v-list-tile-content>
              <v-list-tile-title>Text Inputs</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon></v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile to="/select-boxes">
            <v-list-tile-content>
              <v-list-tile-title>Selects</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon></v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile to="/selection-controls">
            <v-list-tile-content>
              <v-list-tile-title>Selection Controls</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon></v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
        <!-- Forms controls -->

        <!-- Buttons -->
        <v-list-tile to="/buttons">
          <v-list-tile-action>
            <v-icon>touch_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Buttons</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- Buttons -->

        <!-- Cards -->
        <v-list-tile to="/cards">
          <v-list-tile-action>
            <v-icon>view_quilt</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Cards</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- Cards -->

        <!-- Alerts -->
        <v-list-tile to="/alerts">
          <v-list-tile-action>
            <v-icon>report_problem</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Alerts</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- Alerts -->

        <!-- Data Tables -->
        <v-list-tile to="/data-tables">
          <v-list-tile-action>
            <v-icon>list_alt</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Data table</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- Data Tables -->

        <!-- Dialogs -->
        <v-list-tile to="/dialogs">
          <v-list-tile-action>
            <v-icon>filter_none</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Dialogs</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- Dialogs -->

        <!-- Pickers -->
        <v-list-group prepend-icon="calendar_today" no-action>
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>Pickers</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/date-pickers">
            <v-list-tile-content>
              <v-list-tile-title>Date Pickers</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon></v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile to="/time-pickers">
            <v-list-tile-content>
              <v-list-tile-title>Time Pickers</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon></v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
        <!-- Pickers -->

        <!-- Snackbars -->
        <v-list-tile to="/snackbars">
          <v-list-tile-action>
            <v-icon>announcement</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Snackbars</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- Snackbars -->

        <v-list-group prepend-icon="account_circle">
          <v-list-tile slot="activator">
            <v-list-tile-title>Multi Level Menu</v-list-tile-title>
          </v-list-tile>
          <v-list-group sub-group no-action>
            <v-list-tile slot="activator">
              <v-list-tile-title>Admin</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-for="(admin, i) in admins" :key="i" >
              <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
              <v-list-tile-action>
                <v-icon v-text="admin[1]"></v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
          <v-list-group sub-group no-action>
            <v-list-tile slot="activator">
              <v-list-tile-title>Actions</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-for="(crud, i) in cruds" :key="i" >
              <v-list-tile-title v-text="crud[0]"></v-list-tile-title>
              <v-list-tile-action>
                <v-icon v-text="crud[1]"></v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app light class="white">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn flat class="hidden-sm-and-down">Link One</v-btn>
      <v-btn flat class="hidden-sm-and-down">Link Two</v-btn> -->
      <v-badge overlap color="red">
        <small slot="badge">3</small>
        <v-avatar color="transparent red--after" size="36">
          <v-icon light>notifications</v-icon>
        </v-avatar>
      </v-badge>
      <v-badge overlap color="red">
        <small slot="badge">5</small>
        <v-avatar color="transparent red--after" size="36">
          <v-icon light>email</v-icon>
        </v-avatar>
      </v-badge>
      <v-menu bottom left transition="slide-y-transition">
        <v-btn slot="activator" icon>
          <v-icon class="grey--text text--darken-1">account_circle</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile >
            <v-list-tile-action>
              <v-icon>person</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Profile</v-list-tile-title>
          </v-list-tile>
          <v-list-tile to="/settings">
            <v-list-tile-action>
              <v-icon>settings</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile>
          <v-list-tile >
            <v-list-tile-action>
              <v-icon>lock_open</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      title: 'VueMax Admin',
      drawer: true,
      admins: [
        ['Management', 'people_outline'],
        ['Settings', 'settings']
      ],
      cruds: [
        ['Create', 'add'],
        ['Read', 'insert_drive_file'],
        ['Update', 'update'],
        ['Delete', 'delete']
      ],
      types: [
        ['Headings', 'people_outline'],
        ['Sub Heading', 'settings']
      ]
    }
  }
}
</script>
