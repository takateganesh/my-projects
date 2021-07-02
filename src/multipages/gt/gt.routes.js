import Vue from 'vue';
import Router from 'vue-router';
import { nav } from 'oak-vuex';
const { beforeEachRoute } = nav;

import OakLayout from '@/components/layout/OakLayout';
import ErrorPage from '@/routes/gate/error';
import HomePage from '@/routes/oak/home';

import OrganizationsPage from '@/routes/oak/organizations';
import OrganizationOpsPage from '@/routes/oak/organization.ops';
import OrganizationEditPage from '@/routes/oak/organization.edit';

import OrganizationTeamMembershipEditPage from '@/routes/oak/organization_team_membership.edit';
import OrganizationTeamInviteEditPage from '@/routes/oak/organization_team_invite.edit';

Vue.use(Router);

export const router = new Router({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'GT',
        redirect: '/apps',
        meta: {
            breadcrumb: { label: 'GT' }
        },
        component: OakLayout,
        children: [{
                path: '/',
                name: 'HomePage',
                component: HomePage,
                meta: {
                    breadcrumb: { label: 'Home' }
                }
            },
            {
                path: ':appId/organization/:organizationId',
                name: 'OrganizationOpsPage',
                component: OrganizationOpsPage,
                meta: {
                    breadcrumb: {
                        label: (state) => state.organizationOne.one ? state.organizationOne.one.name : "OpsPage",
                        routeParams: { organizationId: (state) => state.organizationOne.one ? state.organizationOne.one.id : "OrganizationId" },
                        parent: 'Organizations'
                    }
                }
            },
            {
                path: ':appId/organization/:organizationId/edit',
                name: 'OrganizationEditPage',
                component: OrganizationEditPage,
                meta: {
                    breadcrumb: {
                        label: (state) => state.organizationOne.one && state.organizationOne.one.id ? "Edit Organization" : "New Organization",
                        routeParams: { organizationId: (state) => state.organizationOne.one ? state.organizationOne.one.id : "OrganizationId" },
                        parent: 'Organizations'
                    }
                }
            },
            {
                path: ':appId/organization/:organizationId/team-membership/:teamMembershipId/edit',
                name: 'OrganizationTeamMembershipEditPage',
                component: OrganizationTeamMembershipEditPage,
                meta: {
                    breadcrumb: {
                        label: "Team Membership",
                        routeParams: { organizationId: (state) => state.organizationOne.one ? state.organizationOne.one.id : "OrganizationId" },
                        parent: 'OrganizationOpsPage'
                    }
                }
            },
            {
                path: ':appId/organization/:organizationId/team-invite/:teamMembershipId/edit',
                name: 'OrganizationTeamInviteEditPage',
                component: OrganizationTeamInviteEditPage,
                meta: {
                    breadcrumb: {
                        label: "Team Invite",
                        routeParams: { organizationId: (state) => state.organizationOne.one ? state.organizationOne.one.id : "OrganizationId" },
                        parent: 'OrganizationOpsPage'
                    }
                }
            },
            {
                path: 'error',
                name: 'ErrorPage',
                component: ErrorPage,
            },

        ]
    }]
});

router.beforeEach = beforeEachRoute;