/* eslint-disable no-debugger */
import { auth, nav } from 'oak-vuex'

const { wrapRequest } = nav;
const { getHubAuthHeader } = auth;
const hubName = process.env.VUE_APP_OAK_HUB_NAME;

const doTeamAssignUser = wrapRequest((team) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getHubAuthHeader(hubName)
        },
        body: JSON.stringify({ app_id: team.app_id, user_id: team.user_id, organization_id: team.organization_id, team_id: team.team_id, team_roles: team.team_roles, resource_id: team.resource_id })
    };
    return fetch(`${process.env.VUE_APP_OAK_API_URL}/rpc/team_assign_user`, requestOptions);
});
const doTeamChangeMembership = wrapRequest((membership) => {
    if(membership.activation_date || membership.termination_date){
        membership.activation_date = new Date(membership.activation_date.activate_date + ' ' + membership.activation_date.activate_time);
        membership.termination_date = new Date(membership.termination_date.terminate_date + ' ' + membership.termination_date.terminate_time);
    }
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', ...getHubAuthHeader(hubName)
        },
        body: JSON.stringify({
            changes: {
                team_id: membership.team_id,
                team_roles: membership.team_roles,
                activation_date: membership.activation_date,
                termination_date: membership.termination_date,
                resource_id: membership.resource_id
            },
            team_membership_id:membership.id})
    };
    return fetch(`${process.env.VUE_APP_OAK_API_URL}/rpc/team_change_membership`, requestOptions)
});
const doFetchOne = wrapRequest((id) => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-type': 'application/json', 'Accept': 'application/vnd.pgrst.object+json', ...getHubAuthHeader(hubName) },
    };
    return fetch(`${process.env.VUE_APP_OAK_API_URL}/team_membership?id=eq.${id}`, requestOptions);
});
const doTeamRevokeUser = wrapRequest((member) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getHubAuthHeader(hubName)
        },
        body: JSON.stringify({ organization_id: member.team.organization_id, team: member.team.team, app_id: member.app_id, user_id: member.team.user_id})
    };
    return fetch(`${process.env.VUE_APP_OAK_API_URL}/rpc/team_revoke_user`, requestOptions);
});
const doToogleAdmin = wrapRequest((admin) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getHubAuthHeader(hubName)
        },
        body: JSON.stringify({
            app_id: admin.appId,
            user_id: admin.userId,
            enable: admin.enable
        })
    };
    return fetch(`${process.env.VUE_APP_OAK_API_URL}/rpc/user_toggle_admin`, requestOptions);
});
const doInvitePostOne = wrapRequest((team) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', ...getHubAuthHeader(hubName)
        },
        body: JSON.stringify({email:team.email, app_id:team.appId, team_details:{organization_id: team.organizationId,team:team.team,roles:team.teamRoles}, user_details:{first_name: team.firstName,middle_name:team.middleName,last_name:team.lastName},
            team_membership_id:team.id})
    };
    return fetch(`${process.env.VUE_APP_OAK_API_URL}/rpc/team_invite`, requestOptions)
});

const doCheckInvitation = wrapRequest((token) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 'Accept': 'application/vnd.pgrst.object+json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({invitation_id: token })
    };
    return fetch(`${process.env.VUE_APP_OAK_API_URL}/rpc/team_check_invitation`, requestOptions);

});

export const oakService = {
    doTeamAssignUser,
    doTeamRevokeUser,
    doToogleAdmin,
    doTeamChangeMembership,
    doFetchOne,
    doInvitePostOne,
    doCheckInvitation
};