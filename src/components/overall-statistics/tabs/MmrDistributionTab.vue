<template>
  <div>
    <v-row align="center">
      <v-col cols="md-2">
        <v-card-text>
          <v-select
            v-model="selectedSeason"
            :items="seasons"
            item-text="id"
            :label="$t(`components_overall-statistics_tabs_mmrdistributiontab.selectseason`)"
            return-object
            outlined
          />

          <v-select
            v-model="selectedGameMode"
            class="over-chart-select-box"
            :items="activeGameModes()"
            item-text="name"
            item-value="id"
            @change="gameModeChanged"
            :label="$t(`components_overall-statistics_tabs_mmrdistributiontab.mode`)"
            outlined
          />
        </v-card-text>
        <v-card-text v-if="!loadingMapAndRaceStats && isGatewayNeeded">
          <gateway-select @gatewayChanged="gatewayChanged" />
        </v-card-text>

        <v-card-text>
          {{ $t("components_overall-statistics_tabs_mmrdistributiontab.stddev") }}
          <div>{{ standardDeviation }}</div>
        </v-card-text>
        <v-card-text>
          {{ $t("components_overall-statistics_tabs_mmrdistributiontab.purplebarsdesc") }}
        </v-card-text>
        <v-card-text v-if="authCode">
          {{ $t("components_overall-statistics_tabs_mmrdistributiontab.greenbardesc") }}
        </v-card-text>
      </v-col>
      <v-col cols="md-10">
        <div class="text-center my-auto">
          <v-progress-circular indeterminate v-if="loadingData"></v-progress-circular>
        </div>
        <mmr-distribution-chart
          v-if="!loadingData"
          :mmr-distribution="mmrDistribution"
          :selected-season="selectedSeason"
          :selected-game-mode="selectedGameMode"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { activeGameModes, loadActiveGameModes } from "@/mixins/GameModesMixin";
import { Gateways, Season } from "@/store/ranking/types";
import { MmrDistribution, SeasonGameModeGateWayForMMR } from "@/store/overallStats/types";
import { EGameMode } from "@/store/types";
import GatewaySelect from "@/components/common/GatewaySelect.vue";
import MmrDistributionChart from "@/components/overall-statistics/MmrDistributionChart.vue";
import { useOauthStore } from "@/store/oauth/store";
import { useOverallStatsStore } from "@/store/overallStats/store";
import { usePlayerStore } from "@/store/player/store";
import { useRankingStore } from "@/store/ranking/store";

export default defineComponent({
  name: "MmrDistributionTab",
  components: {
    MmrDistributionChart,
    GatewaySelect,
  },
  setup() {
    const oauthStore = useOauthStore();
    const overallStatsStore = useOverallStatsStore();
    const player = usePlayerStore();
    const rankingsStore = useRankingStore();

    const selectedGameMode = ref<EGameMode>(EGameMode.GM_1ON1);
    const selectedGateWay = ref<Gateways>(Gateways.Europe);
    const selectedSeasonRef = ref<Season>({ id: 1 });
    const loadingData = ref<boolean>(true);
    const loadingMapAndRaceStats = ref<boolean>(overallStatsStore.loadingMapAndRaceStats);

    const verifiedBtag = computed<string>(() => oauthStore.blizzardVerifiedBtag);
    const authCode = computed<string>(() => oauthStore.token);
    const seasons = computed<Season[]>(() => rankingsStore.seasons);
    const mmrDistribution = computed<MmrDistribution>(() => overallStatsStore.mmrDistribution);
    const standardDeviation = computed<string>(() => mmrDistribution.value?.standardDeviation?.toString() ?? "-");
    const isGatewayNeeded = computed<boolean>(() => selectedSeason.value.id <= 5);

    const selectedSeason = computed<Season>({
      get(): Season {
        return selectedSeasonRef.value;
      },
      async set(season: Season): Promise<void> {
        selectedSeasonRef.value = season;
        loadingData.value = true;
        if (verifiedBtag.value) {
          await player.loadProfile({
            battleTag: verifiedBtag.value,
            freshLogin: false,
          });
          await player.loadGameModeStats({
            battleTag: verifiedBtag.value,
            season: season.id,
          });
        }
        updateMMRDistribution();
      },
    });

    async function updateMMRDistribution() {
      const payload: SeasonGameModeGateWayForMMR = {
        season: selectedSeasonRef.value.id,
        gameMode: selectedGameMode.value,
        gateWay: selectedGateWay.value,
      };
      await overallStatsStore.loadMmrDistribution(payload);
      loadingData.value = false;
    }

    function gameModeChanged(gameMode: EGameMode) {
      selectedGameMode.value = gameMode;
      updateMMRDistribution();
    }

    function gatewayChanged(gateWay: Gateways) {
      selectedGateWay.value = gateWay;
      updateMMRDistribution();
    }

    onMounted(() => init());

    async function init() {
      await loadActiveGameModes();
      await rankingsStore.retrieveSeasons();
      selectedSeason.value = seasons.value[0];
    }

    return {
      selectedSeason,
      seasons,
      selectedGameMode,
      gameModeChanged,
      activeGameModes,
      loadingMapAndRaceStats,
      isGatewayNeeded,
      gatewayChanged,
      standardDeviation,
      authCode,
      loadingData,
      mmrDistribution,
    };
  },
});
</script>
