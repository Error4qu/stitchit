package com.stitchit.dto;

import com.stitchit.entity.AlterationStatus;

import java.math.BigDecimal;
import java.util.Map;

public class RevenueSummaryResponse {

    /** Revenue from DELIVERED orders — money actually earned. */
    private BigDecimal realizedRevenue;

    /** Revenue from orders still in the pipeline (not yet delivered). */
    private BigDecimal pipelineRevenue;

    private long totalOrders;

    private Map<AlterationStatus, Long> ordersByStatus;

    public RevenueSummaryResponse() {}

    public RevenueSummaryResponse(BigDecimal realizedRevenue, BigDecimal pipelineRevenue,
                                  long totalOrders, Map<AlterationStatus, Long> ordersByStatus) {
        this.realizedRevenue = realizedRevenue;
        this.pipelineRevenue = pipelineRevenue;
        this.totalOrders = totalOrders;
        this.ordersByStatus = ordersByStatus;
    }

    public BigDecimal getRealizedRevenue() { return realizedRevenue; }
    public void setRealizedRevenue(BigDecimal realizedRevenue) { this.realizedRevenue = realizedRevenue; }
    public BigDecimal getPipelineRevenue() { return pipelineRevenue; }
    public void setPipelineRevenue(BigDecimal pipelineRevenue) { this.pipelineRevenue = pipelineRevenue; }
    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
    public Map<AlterationStatus, Long> getOrdersByStatus() { return ordersByStatus; }
    public void setOrdersByStatus(Map<AlterationStatus, Long> ordersByStatus) { this.ordersByStatus = ordersByStatus; }
}
