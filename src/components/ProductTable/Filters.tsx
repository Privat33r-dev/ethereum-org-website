import { useTranslation } from "next-i18next"
import { BsArrowCounterclockwise } from "react-icons/bs"

import { FilterInputState, FilterOption } from "@/lib/types"

import { Button } from "@/components/ui/buttons/Button"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/../tailwind/ui/accordion"

interface PresetFiltersProps {
  filters: FilterOption[]
  activeFiltersCount: number
  setFilters: (filterOptions: FilterOption[]) => void
  resetFilters: () => void
}

const Filters = ({
  filters,
  setFilters,
  resetFilters,
  activeFiltersCount,
}: PresetFiltersProps) => {
  const { t } = useTranslation("page-wallets-find-wallet")

  const updateFilterState = (
    filterIndex: number,
    itemIndex: number,
    newInputState: FilterInputState,
    optionIndex?: number
  ) => {
    const updatedFilters = filters.map((filter, idx) => {
      if (idx === filterIndex) {
        const updatedItems = filter.items.map((item, i) => {
          if (i === itemIndex) {
            if (typeof optionIndex !== "undefined") {
              const updatedOptions = item.options.map((option, j) => {
                if (j === optionIndex) {
                  return {
                    ...option,
                    inputState: newInputState,
                  }
                }
                return option
              })
              return {
                ...item,
                options: updatedOptions,
              }
            }
            return {
              ...item,
              inputState: newInputState,
            }
          }
          return item
        })
        return {
          ...filter,
          items: updatedItems,
        }
      }
      return filter
    })
    setFilters(updatedFilters)
  }

  return (
    <div className={`w-full lg:w-80`}>
      <div className="width-full flex flex-row items-center justify-between border-b border-b-primary px-2 py-1.5 lg:px-6">
        <p className="text-md font-bold">
          {t("page-find-wallet-filters")} ({activeFiltersCount})
        </p>
        <Button
          variant="ghost"
          className="min-h-0 gap-1 p-0"
          onClick={resetFilters}
        >
          <BsArrowCounterclockwise size={16} />
          {t("page-find-wallet-reset-filters")}
        </Button>
      </div>
      <Accordion
        type="multiple"
        className="width-full flex flex-col gap-2"
        defaultValue={filters.map((_, idx) => `item ${idx}`)}
      >
        {filters.map((filter, filterIndex) => {
          if (filter.showFilterOption) {
            return (
              <AccordionItem
                key={filterIndex}
                value={`item ${filterIndex}`}
                className="bg-background-highlight p-6"
              >
                <AccordionTrigger className="border-b border-b-border-accordion">
                  <p className="text-base text-primary-high-contrast">
                    {filter.title}
                  </p>
                </AccordionTrigger>
                <AccordionContent className="p-0 md:p-0">
                  {filter.items.map((item, itemIndex) => {
                    return (
                      <>
                        {item.input(
                          filterIndex,
                          itemIndex,
                          item.inputState,
                          updateFilterState
                        )}
                        {item.inputState === true && item.options.length ? (
                          <div className="flex flex-row gap-6 px-2 pb-4">
                            {item.options.map((option, optionIndex) => {
                              return option.input(
                                filterIndex,
                                itemIndex,
                                optionIndex,
                                option.inputState,
                                updateFilterState
                              )
                            })}
                          </div>
                        ) : null}
                      </>
                    )
                  })}
                </AccordionContent>
              </AccordionItem>
            )
          }
        })}
      </Accordion>
    </div>
  )
}

export default Filters
