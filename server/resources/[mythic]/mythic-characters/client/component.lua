Characters = nil

AddEventHandler("Characters:Shared:DependencyUpdate", RetrieveComponents)
function RetrieveComponents()
	Callbacks = exports["mythic-base"]:FetchComponent("Callbacks")
	Characters = exports["mythic-base"]:FetchComponent("Characters")
	Action = exports["mythic-base"]:FetchComponent("Action")
	Ped = exports["mythic-base"]:FetchComponent("Ped")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["mythic-base"]:RequestDependencies("Characters", {
		"Callbacks",
		"Characters",
		"Action",
		"Ped",
	}, function(error)
		if #error > 0 then
			return
		end
		RetrieveComponents()
	end)
end)

RegisterNetEvent("Characters:Client:SetData", function(key, data, cb)
	if key ~= -1 then
		LocalPlayer.state.Character:SetData(key, data)
	else
		LocalPlayer.state.Character =
			exports["mythic-base"]:FetchComponent("DataStore"):CreateStore(1, "Character", data)
	end

	exports["mythic-base"]:FetchComponent("Player").LocalPlayer:SetData("Character", LocalPlayer.state.Character)
	TriggerEvent("Characters:Client:Updated", key)

	if cb then
		cb()
	end
end)

CHARACTERS = {
	Updating = true,
	Logout = function(self)
		DoScreenFadeOut(500)
		while IsScreenFadingOut() do
			Citizen.Wait(1)
		end
		Callbacks:ServerCallback("Characters:Logout", {}, function()
			LocalPlayer.state.Char = nil
			LocalPlayer.state.Character = nil
			LocalPlayer.state.loggedIn = false
			LocalPlayer.state:set('SID', nil, true)
			Action:Hide()
			exports["mythic-base"]:FetchComponent("Spawn"):InitCamera()
			SendNUIMessage({
				type = "APP_RESET",
			})
			Citizen.Wait(500)
			exports["mythic-base"]:FetchComponent("Spawn"):Init()
		end)
	end,
}

AddEventHandler("Proxy:Shared:RegisterReady", function()
	exports["mythic-base"]:RegisterComponent("Characters", CHARACTERS)
end)
