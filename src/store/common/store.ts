import { defineStore } from "pinia";
import { CommonState } from "./types";
import { HeroFilter } from "../heroes";
import HeroService from "@/services/HeroService";

export const useCommonStore = defineStore("commonState", {
  state: (): CommonState => ({
    heroFilters: [] as HeroFilter[],
    selectedHeroes: [] as number[],
  } as CommonState),
  actions: {
    async loadHeroFilters() {
      const filters = await HeroService.retrieveHeroes();
      this.SET_HERO_FILTERS(filters);
    },
    getDefaultHeroFilter(): HeroFilter | undefined {
      if (this.heroFilters.length > 0) {
        return this.heroFilters.find((hero) => hero.name === "all");
      } else {
        return undefined;
      }
    },
    setSelectedHeroes(heroes: number[]): void {
      this.SET_SELECTED_HEROES(heroes);
    },
    SET_HERO_FILTERS(heroFilters: HeroFilter[]): void {
      this.heroFilters = heroFilters;
    },
    SET_SELECTED_HEROES(heroes: number[]): void {
      this.selectedHeroes = heroes;
    },
  },
});
