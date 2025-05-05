AddEventHandler("Buffs:Shared:DependencyUpdate", RetrieveComponents)
function RetrieveComponents()
	Buffs = exports["mythic-base"]:FetchComponent("Buffs")
	Hud = exports["mythic-base"]:FetchComponent("Hud")
	Callbacks = exports["mythic-base"]:FetchComponent("Callbacks")
	Progress = exports["mythic-base"]:FetchComponent("Progress")
	Action = exports["mythic-base"]:FetchComponent("Action")
	Keybinds = exports["mythic-base"]:FetchComponent("Keybinds")
	ListMenu = exports["mythic-base"]:FetchComponent("ListMenu")
	Notification = exports["mythic-base"]:FetchComponent("Notification")
	Minigame = exports["mythic-base"]:FetchComponent("Minigame")
	Interaction = exports["mythic-base"]:FetchComponent("Interaction")
	Utils = exports["mythic-base"]:FetchComponent("Utils")
	Phone = exports["mythic-base"]:FetchComponent("Phone")
	Inventory = exports["mythic-base"]:FetchComponent("Inventory")
	Weapons = exports["mythic-base"]:FetchComponent("Weapons")
	Jail = exports["mythic-base"]:FetchComponent("Jail")
	Animations = exports["mythic-base"]:FetchComponent("Animations")
	Admin = exports["mythic-base"]:FetchComponent("Admin")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["mythic-base"]:RequestDependencies("Buffs", {
		"Buffs",
		"Hud",
		"Callbacks",
		"Action",
		"Progress",
		"Keybinds",
		"ListMenu",
		"Notification",
		"Minigame",
		"Interaction",
		"Utils",
		"Phone",
		"Inventory",
		"Weapons",
		"Jail",
		"Animations",
		"Admin",
	}, function(error)
		if #error > 0 then
			return
		end
		RetrieveComponents()
	end)
end)

local _runningIds = 1
local _buffDefs = {}

local _BUFFS = {
	RegisterBuff = function(self, id, icon, color, duration, type)
		_buffDefs[id] = {
			icon = icon,
			color = color,
			duration = duration,
			type = type,
		}
		SendNUIMessage({
			type = "REGISTER_BUFF",
			data = {
				id = id,
				data = {
					icon = icon,
					color = color,
					duration = duration,
					type = type,
				},
			},
		})
	end,
	ApplyBuff = function(self, buffId, val, override, options)
		SendNUIMessage({
			type = "BUFF_APPLIED",
			data = {
				instance = {
					buff = buffId,
					override = override,
					val = math.ceil(val or 0),
					options = options or {},
					startTime = GetCloudTimeAsInt(),
				},
			},
		})
	end,
	ApplyUniqueBuff = function(self, buffId, val, override, options)
		SendNUIMessage({
			type = "BUFF_APPLIED_UNIQUE",
			data = {
				instance = {
					buff = buffId,
					override = override,
					val = math.ceil(val or 0),
					options = options or {},
					startTime = GetCloudTimeAsInt(),
				},
			},
		})
	end,
	UpdateBuff = function(self, buffId, nVal)
		SendNUIMessage({
			type = "BUFF_UPDATED",
			data = {
				buff = buffId,
				val = nVal,
			},
		})
	end,
	IconOverride = function(self, buffId, override)
		SendNUIMessage({
			type = "BUFF_UPDATED",
			data = {
				buff = buffId,
				override = override,
			},
		})
	end,
	RemoveBuffType = function(self, buffId)
		SendNUIMessage({
			type = "REMOVE_BUFF_BY_TYPE",
			data = {
				type = buffId,
			},
		})
	end,
}

AddEventHandler("Proxy:Shared:RegisterReady", function()
	exports["mythic-base"]:RegisterComponent("Buffs", _BUFFS)
end)

RegisterNetEvent("Characters:Client:Spawned", function()
    _BUFFS:RegisterBuff("prog_mod", "mug-hot", "#D6451A", -1, "timed")
    _BUFFS:RegisterBuff("stress_ticks", "joint", "#de3333", -1, "timed")
    _BUFFS:RegisterBuff("heal_ticks", "suitcase-medical", "#52984a", -1, "timed")
    _BUFFS:RegisterBuff("armor_ticks", "dumbbell", "#4056b3", -1, "timed")
end)

RegisterNetEvent("Characters:Client:Logout", function()
    _BUFFS:RemoveBuffType("prog_mod")
    _BUFFS:RemoveBuffType("stress_ticks")
    _BUFFS:RemoveBuffType("heal_ticks")
    _BUFFS:RemoveBuffType("armor_ticks")
end)
